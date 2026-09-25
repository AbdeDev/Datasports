# Datasports

**Datasports/Elite scouting** is an internal football scouting platform — the collective memory of the scouting cell. It centralizes player detection, evaluation, and tracking over time, from the pitch to the decision:
 
```
MISSION → MATCH → OBSERVATION → EVALUATION → ANALYSIS → TRACKING → PROGRESSION → DECISION
```
 
The goal isn't just to know whether a player performs today, but to follow their trajectory: who was observed, when, where, by which scout, in which position, how many times, their strengths, their weaknesses, and whether they're improving — so we can decide who to keep watching, prioritize, or contact.
 
## Stack
 
- **Frontend** — Vite + React (TS) + Tailwind + shadcn/ui + TanStack Query/Router → Cloudflare Pages
- **API** — AdonisJS 6 (TS) + Lucid ORM → Render
- **Database & Auth** — Supabase (Postgres + Auth)
## Structure
 
pnpm monorepo: `apps/web` (frontend) · `apps/api` (Adonis backend) · migrations and seeds under `apps/api/database`.
 
---
 
## ⚠️ Branching model
 
> **`main` is reserved for production deployment.** Never push to it directly and never open a PR against it: it only receives what has been validated on `staging`.
 
- **`main`** → production. Protected. Production deployment only.
- **`staging`** → integration branch. This is **the starting point for all work**.
### 👀 Contributors & viewers — read this before touching the code
 
If you want to **explore, test, or contribute** to the code:
 
1. **Always branch off `staging`**, never `main`. `main` may be ahead of or behind current work; `staging` is the source of truth for development.
2. **Create your branch from `staging`:**
```bash
   git checkout staging
   git pull
   git checkout -b feat/my-feature
```
3. **Open every Pull Request against `staging`** — never against `main`. A PR targeting `main` will be closed.
4. Name branches and commits using **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `ci:`).
5. Keep PRs **small and frequent**. CI (Biome lint → typecheck → test → build) must be green before merge.
The `staging → main` promotion (i.e. going to production) is handled separately, once the integration is validated.
 
---
 
## Local setup
 
```bash
pnpm install
make dev        # frontend + api in parallel
```
 
See each app's `.env.example` for environment variables.
 
