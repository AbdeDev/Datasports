# Frontend Elite75

## Où travailler

La branche de refonte est `feat/frontend-redesign`, directement dans
`/Users/layayance/Datasports`. Depuis ce dossier :

```bash
git switch feat/frontend-redesign
npm run dev:demo
```

Pour utiliser le backend configuré : `npm run dev:front`.
L'ancien worktree temporaire reste une sauvegarde détachée, pas le dossier de travail.

## Démarrer

Depuis le dossier Datasports, avec les dépendances installées :

1. Copier `apps/web/.env.example` vers `apps/web/.env`.
2. Renseigner `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` et `VITE_API_URL` avec les valeurs de l'équipe.
3. Exécuter `cd apps/web && npm run dev`.

L'URL API est l'origine du serveur (sans le suffixe /api/v1).
Ne jamais mettre de clé Supabase service_role dans le frontend.
Le frontend affiche les variables manquantes si la configuration est absente.

## Contrat conservé

React + TypeScript + Vite, TanStack Router/Query.
Supabase sert uniquement à l'authentification. Le JWT est envoyé dans
`Authorization: Bearer …` à l'API AdonisJS.

- Profil courant : GET /api/v1/me
- Missions : GET /api/v1/missions et GET /api/v1/missions/:id
- Actions : POST respond, withdraw, reassign, cancel, targets sous une mission
- Évaluations : POST /api/v1/missions/:id/observations
- Analyse : PATCH /api/v1/missions/:id/observation/analysis
- Joueurs : GET /api/v1/players et GET /api/v1/players/:id
- Référentiels : clubs, matches, scouts et evaluation-grids/active

Les routes et contrôleurs backend ont été lus, sans modification.
Recherche et filtres de la watchlist s'appliquent aux données de l'API.
Les compteurs du dashboard utilisent les missions et joueurs retournés ;
aucun objectif ou statut de connexion fictif.

## Vérifications

TypeScript et build Vite réussis. Le diff ne contient aucune modification dans apps/api.
La validation réelle de la connexion et des opérations métier nécessite la configuration
de l'équipe et un compte de test. Elle n'a pas été effectuée.
L'aperçu navigateur local n'a pas pu être validé : connexion locale refusée puis expiration du délai.

## Git

Aucun commit ni push effectué. Conserver les changements dans feat/frontend-redesign.
Vérifier `git branch --show-current` avant tout commit. La branche cible d'une future PR
doit être convenue avec le responsable du backend ; le point de départ de cette branche
est actuellement origin/Stagging.


## Tester sans backend

Depuis `apps/web`, exécuter `npm run dev:demo` puis ouvrir http://localhost:3000
(ou le port indiqué par Vite). Aucune clé ni compte requis.
Le mode démo propose le dashboard, les missions, la watchlist, les fiches joueurs et
une grille illustrative. Toutes les données sont fictives ; les écritures sont refusées
avec un message explicite. Recharger réinitialise les données.
Il ne valide pas l'authentification ni les opérations métier du serveur.

Pour revenir au backend : arrêter avec Ctrl+C et lancer `npm run dev` avec le
fichier .env configuré. Le mode démo est limité à Vite en développement ; même
un build avec --mode demo conserve l'authentification réelle.

Vérifications du mode démo : TypeScript, cohérence des liens mission/joueur,
refus POST/PATCH, identifiants inconnus, isolation des données et build production.
