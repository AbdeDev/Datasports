# Guide de développement

Ce document complète le [README](./README.md) : workflow git, conventions de code et pièges connus pour contribuer à Elite scouting.

## Workflow git

- **`Stagging`** est la branche de travail (trunk) : toute branche `feat/`, `fix/` ou `chore/` en part et y est mergée par PR une fois la CI verte.
- **`main`** est réservée aux releases : elle n'est mergée depuis `Stagging` que lorsqu'un ensemble de fonctionnalités est testé et prêt à déployer — jamais automatiquement à chaque PR.
- Une PR = une étape fonctionnelle cohérente (voir l'historique de commits pour le grain habituel).
- Ne jamais forcer un push sur `Stagging` ou `main`.

## Commits

Convention [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, ...), vérifiée par commitlint via un hook Lefthook sur chaque commit.

## Style de code

- **Biome** est le seul outil de lint + format (pas d'ESLint/Prettier). `bun run lint:fix` avant de committer — un hook pre-commit le fait déjà automatiquement sur les fichiers stagés.
- **Bun** est le seul gestionnaire de paquets du monorepo (pas de npm/pnpm/yarn) : `bun install`, `bun run <script>`, `bun run --filter './apps/*' <script>` pour cibler les deux apps.
- Pas de commentaires qui décrivent *quoi* fait le code (les noms doivent déjà le dire) — seulement le *pourquoi* quand ce n'est pas évident (contrainte cachée, choix produit non intuitif).

## Sécurité — fichiers d'environnement

**`.env.example` est commité, `.env` ne l'est jamais.** Un hook pre-commit (`scripts/check-env-example.sh`) bloque tout `.env.example` contenant une valeur qui ressemble à un vrai secret (URL avec identifiants, chaîne longue sur une variable `*_SECRET`/`*_KEY`/`*_TOKEN`/`*_PASSWORD`, etc.).

Si un secret réel est accidentellement commité/poussé : le traiter comme compromis et le **faire tourner** (rotate) immédiatement — ne jamais compter sur un simple retrait du fichier ou une réécriture d'historique comme seule mitigation.

Chaque app a son propre `.env.example` (`apps/api/`, `apps/web/`) — il n'y a pas de `.env.example` à la racine.

## Architecture backend (`apps/api`)

Pattern strict : **controller (fin) → service (logique métier) → modèle Lucid**.

- Chaque modèle déclare explicitement `static table = "..."` — la pluralisation automatique de Lucid se trompe sur certains noms composés (ex. `player_status_history`), donc on ne s'y fie jamais.
- Les colonnes `jsonb` (tableaux de strings) utilisent `@column({ prepare: (value) => JSON.stringify(value) })`.
- Les erreurs métier sont des classes dédiées par service (`XxxForbiddenError`, `XxxConflictError`), catchées dans le controller pour mapper vers le bon code HTTP (403/409/...).
- Les statuts (mission, joueur) sont des transitions, jamais un hard delete : annuler une mission = passer son statut à `annulee`, pas supprimer la ligne.

## Architecture frontend (`apps/web`)

- Organisation **par feature** : `src/features/<domaine>/{api.ts, hooks.ts, components/}` — `api.ts` définit les types + appels HTTP + `queryOptions`, `hooks.ts` les mutations React Query (avec toasts succès/erreur).
- Routes **TanStack Router en fichiers plats** : `missions.$id.tsx` → `/missions/$id`, pas de dossiers imbriqués.

### ⚠️ Piège : routes imbriquées et `<Outlet />`

Si un fichier de route partage un préfixe avec un autre (ex. `missions.$id.tsx` et `missions.$id.evaluate.tsx`), TanStack Router les traite comme **parent/enfant** — la route enfant ne s'affichera **jamais** tant que le composant parent ne rend pas explicitement un `<Outlet />`. Symptôme typique : cliquer sur un lien change bien l'URL mais l'écran ne change pas.

Deux solutions :
1. Ajouter `<Outlet />` dans le parent si l'imbrication (layout partagé) est voulue.
2. Sinon, donner à la route un chemin qui ne partage pas de préfixe avec une route existante (ex. `evaluate.$id.tsx` → `/evaluate/$id` plutôt que `missions.$id.evaluate.tsx`) — c'est l'approche retenue pour l'assistant d'évaluation.

### Auth

Le front n'utilise le SDK Supabase que pour l'authentification (`src/lib/supabase.ts`). Toutes les requêtes de données passent par `src/lib/api.ts`, qui attache le JWT Supabase courant en `Authorization: Bearer`. Le rôle applicatif (`scout`/`admin`) vit uniquement côté API (table `users`), jamais dans le token.

## Base de données

- Les migrations Lucid sont la source de vérité (pas de migrations Supabase CLI).
- **Pas de seed de démo** : les tables métier (clubs, joueurs, matchs, missions) ne sont jamais pré-remplies avec de fausses données — l'app est utilisée en conditions réelles dès le départ. Le seul seeder existant (`evaluation_grid_seeder.ts`) insère une donnée de référence (la grille des 25 critères définie par le brief), pas une donnée de démo — ne pas ajouter d'autre seeder sans une raison équivalente.

### ⚠️ Piège : `DATABASE_URL` et IPv6 (Render)

Le hostname de connexion directe Supabase (`db.<projet>.supabase.co`) résout en **IPv6 uniquement** sauf si l'add-on IPv4 est activé sur le projet. Render (comme beaucoup d'hébergeurs) n'a pas de sortie réseau IPv6 par défaut : chaque requête échoue alors avec `ENETUNREACH` dans les logs, ce qui remonte côté client en simple 500 sans détail. Sur Render, `DATABASE_URL` doit pointer vers le **Session pooler** Supabase (IPv4) plutôt que la connexion directe — dashboard Supabase → Project Settings → Database → Connection Pooling → mode **Session** (pas Transaction, pour rester compatible avec la façon dont Lucid gère son propre pool). Local et CI peuvent garder la connexion directe.

### Écritures multi-tables : toujours en transaction

Toute action qui écrit dans plusieurs tables (créer une mission + ses cibles, soumettre une évaluation + positions + réponses + statut mission + statut joueur + historique) est enveloppée dans `db.transaction(async (trx) => { ... })` (`import db from "@adonisjs/lucid/services/db"`) avec chaque écriture passée via `{ client: trx }` (ou `instance.useTransaction(trx)` avant un `.save()` sur un modèle déjà chargé). Sans ça, une erreur en cours de séquence laisse des données à moitié écrites (ex. une mission "terminée" sans ses réponses).

### Transitions de statut : mises à jour atomiques, pas lire-puis-écrire

Les méthodes qui changent le statut d'une mission (`respond`, `reassign`, `withdraw`, `cancel`, et la transition `acceptee → terminee` dans `ObservationService.create`) utilisent une écriture conditionnelle atomique en une seule requête plutôt qu'un `findOrFail` suivi d'un `.save()` :

```ts
const updated = await Mission.query()
  .where("id", missionId)
  .whereIn("status", allowedStatuses) // condition sur l'état actuel, dans la même requête
  .returning("id")
  .update({ status: newStatus, ... });

if (updated.length === 0) {
  // 0 ligne affectée = quelqu'un d'autre a déjà changé le statut entre-temps
  // (ou la mission n'existe pas / n'appartient pas à cet utilisateur)
}
```

Avec plusieurs admins actifs en même temps, un `findOrFail` puis `.save()` peut laisser deux requêtes concurrentes valider la même précondition avant qu'aucune n'ait écrit — la deuxième écrase alors silencieusement le résultat de la première. La version atomique élimine cette fenêtre : la condition sur le statut fait partie du `WHERE` de l'`UPDATE` lui-même.

## CI

Le job CI a besoin de variables d'environnement factices (non secrètes) pour démarrer l'app Adonis (`.env` n'existe pas sur les runners) — voir le bloc `env:` dans `.github/workflows/ci.yml`. `DATABASE_URL` reste un secret de repo pointant vers le projet Supabase partagé.

## Avant d'ouvrir une PR

1. `bun run lint:fix && bun run lint`
2. `bun run typecheck`
3. `bun run build`
4. Tester le flux concerné manuellement (mobile-first : tester en largeur téléphone).
