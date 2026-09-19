# Elite scouting

Plateforme interne de scouting football — premier produit du groupe Sirius sports-tech.

Elite scouting centralise la détection, l'évaluation et le suivi des joueurs dans le temps, sur mobile comme sur desktop, en remplaçant les carnets/tableurs des scouts par un cycle structuré :

**MISSION → MATCH → OBSERVATION → ÉVALUATION → ANALYSE → SUIVI → PROGRESSION → DÉCISION**

## Fonctionnalités

- **Missions** — un admin crée une mission (match + joueurs à observer) et l'assigne à un scout, qui peut l'accepter, la refuser, se désister ou changer d'avis tant qu'elle ne lui a pas été retirée.
- **Évaluation terrain** — grille de 25 critères (technique, mental, physique, comportement) répartie en une question par écran sur mobile, poste(s) observé(s) via un mini-terrain, impression générale (niveau/potentiel), décision, réponses brutes conservées (jamais de simples moyennes).
- **Analyse automatique + validation** — une synthèse est générée à partir des réponses (points forts/faibles par catégorie), que le scout relit et valide ou corrige ; les deux versions sont conservées.
- **Fiche joueur** — vue d'ensemble, historique de statut, courbe de progression du niveau évalué au fil des observations.
- **Watchlist** — recherche et suivi des joueurs groupés par statut.
- **Dashboard admin** — pilotage des missions (création, réattribution, annulation) et vue d'ensemble.

## Stack technique

| Couche | Techno |
|---|---|
| Backend | AdonisJS, Lucid ORM, VineJS — possède toute la logique métier |
| Base de données | Supabase Postgres (migrations Lucid, pas de RLS/logique métier côté Supabase) |
| Auth | Supabase Auth (JWT) — vérifié côté Adonis via JWKS, rôle applicatif géré en base |
| Frontend | Vite, React, TanStack Router/Query, Tailwind, shadcn (Base UI) |
| Package manager | Bun (workspaces) |
| Qualité | Biome (lint + format), Lefthook (hooks git), commitlint (Conventional Commits) |
| Déploiement | Render (API, Docker) · Cloudflare Pages (front) |

Le front n'appelle jamais Supabase que pour l'authentification (login/signup/reset) ; toutes les données métier transitent par l'API Adonis.

## Structure du monorepo

```
apps/
  api/   AdonisJS — controllers → services → modèles Lucid, migrations, validators
  web/   Vite/React — organisation par feature (features/<domaine>/{api,hooks}.ts), routes TanStack (fichiers plats)
```

## Démarrage local

Prérequis : Bun ≥ 1.1, Node ≥ 26, un projet Supabase (Postgres + Auth).

```bash
bun install

cp apps/api/.env.example apps/api/.env       # renseigner DATABASE_URL, SUPABASE_URL, APP_KEY
cp apps/web/.env.example apps/web/.env       # renseigner VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

cd apps/api && node ace generate:key         # génère APP_KEY
node ace migration:run

bun run dev                                   # lance l'API et le front en parallèle
```

Ne jamais mettre de vraie valeur dans un fichier `.env.example` — voir [DEVELOPMENT.md](./DEVELOPMENT.md) pour le détail des règles de sécurité et du workflow.

## Scripts

| Commande | Effet |
|---|---|
| `bun run dev` | lance l'API et le front en parallèle |
| `bun run lint` / `lint:fix` | Biome (les deux apps) |
| `bun run typecheck` | tsc (les deux apps) |
| `bun run build` | build de production (les deux apps) |
| `bun run test` | tests (les deux apps) |
| `make db-migrate` / `make db-seed` | migrations / seed Lucid |

## Déploiement

- **API** (Render, Docker) : https://dataandsports.onrender.com — `/health` pour vérifier l'état.
- **Front** (Cloudflare Pages) : https://datasports-29j.pages.dev
- **Base de données / Auth** : Supabase (projet `elite-scouting`).

Le déploiement se fait manuellement depuis la branche `Stagging` une fois une PR mergée — voir [DEVELOPMENT.md](./DEVELOPMENT.md) pour le détail du workflow de branches.
