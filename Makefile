.PHONY: dev lint format typecheck test build db-migrate db-seed

dev:
	bun run dev

lint:
	bun run lint

format:
	bun run format

typecheck:
	bun run typecheck

test:
	bun run test

build:
	bun run build

# Ces deux cibles ne fonctionneront qu'à partir de l'étape 2 (apps/api créée)
db-migrate:
	bun --filter api ace migration:run

db-seed:
	bun --filter api ace db:seed
