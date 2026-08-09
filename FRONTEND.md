# Frontend Datasports

Responsable : Yaya

## Stack

```text
Next.js
React
TypeScript
Tailwind CSS
```

## Objectif

Construire une interface extrêmement simple permettant à un directeur sportif de comprendre rapidement :

```text
CLUB
 ↓
Performance
Effectif
Forces
Faiblesses
Besoins
 ↓
RECRUITMENT NEED
 ↓
PLAYER SEARCH
 ↓
SHORTLIST
 ↓
COMPARISON
 ↓
VIDEO
 ↓
REPORT
```

## Pages principales

```text
/
Dashboard général

/clubs
Liste des clubs

/clubs/[id]
Analyse complète d’un club

/players
Base joueurs

/search
Recherche et filtres joueurs

/shortlist
Shortlist liée à un besoin recrutement

/compare
Comparaison de plusieurs joueurs

/reports
Rapports de recrutement
```

## Structure prévue

```text
frontend/src/
├── app/
├── components/
│   ├── layout/
│   ├── club/
│   ├── player/
│   ├── recruitment/
│   └── charts/
├── services/
├── types/
└── utils/
```

## Composants importants

```text
Sidebar
Header
ClubHeader
ClubOverview
PerformanceCard
SquadOverview
ClubNeeds
RecruitmentNeedCard
PlayerFilters
PlayerTable
PlayerCard
PlayerComparison
Shortlist
VideoAnalysis
ReportPreview
```

## Communication avec le backend

Le frontend ne doit pas contenir la logique complexe de scoring.

Exemple :

```text
Frontend
   ↓
GET /api/clubs/lausanne
   ↓
FastAPI
   ↓
PostgreSQL
```

Recherche joueur :

```text
Frontend

Position: DM
Age: 18-24
Budget: < 1M€
Role: Ball-winning midfielder

        ↓

Backend

Filtres
+
Scoring
+
Matching

        ↓

Frontend

1. Player A — Fit 91
2. Player B — Fit 87
3. Player C — Fit 84
```

## Types TypeScript

Les données reçues depuis le backend devront être typées.

Exemple :

```ts
export interface Player {
  id: number;
  name: string;
  age: number;
  nationality: string;
  position: string;
  club: string;
  marketValue?: number;
  fitScore?: number;
}
```

## Priorité MVP

Pour la première version :

```text
1. Layout / Sidebar
2. Club Dashboard
3. Club Needs
4. Player Search
5. Filtres
6. Shortlist
7. Player Comparison
8. Rapport
```

Ne pas développer pour le moment :

- IA complexe côté frontend
- animations inutiles
- système de design trop complexe
- fonctionnalités administratives secondaires

Priorité : **simple, rapide, professionnel et utilisable.**
