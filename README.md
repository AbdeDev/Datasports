# Datasports

Plateforme de scouting, d’analyse et d’aide au recrutement pour les clubs de football.

L’objectif est de transformer les besoins sportifs d’un club en recommandations de joueurs adaptées à son contexte :

**Club → Objectifs → Diagnostic → Besoins mercato → Profil recherché → Recherche joueurs → Shortlist → Comparaison → Vidéo → Rapport**

## Architecture

Le projet est séparé en deux parties principales :

```text
Datasports/
├── frontend/       # Interface utilisateur
├── backend/        # API, données et moteur de recommandation
├── README.md
└── FRONTEND.md
```

## Frontend — Yaya

Technologies :

- Next.js
- React
- TypeScript
- Tailwind CSS

Responsabilités principales :

- Dashboard club
- Analyse visuelle de l’effectif
- Club Needs
- Recherche de joueurs
- Filtres
- Shortlists
- Comparaison de joueurs
- Intégration vidéo
- Visualisation des données
- Génération / export des rapports

Le frontend consomme les données fournies par l’API backend.

## Backend / Data — Abd

Technologies principales prévues :

- Python
- FastAPI
- PostgreSQL
- Pandas / Polars

Responsabilités principales :

- Base de données
- Data ingestion
- Data pipeline
- API
- Player scoring
- Filtres
- Matching joueur / besoin club
- Recommendation engine

## MVP

Le premier cas réel utilisé pour construire et tester la plateforme est :

**FC Lausanne-Sport**

L’objectif n’est pas de construire immédiatement une plateforme parfaite, mais un produit réellement utilisable pour analyser un club et produire une shortlist de recrutement cohérente.
