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

db-migrate:
	cd apps/api && node ace migration:run

db-seed:
	cd apps/api && node ace db:seed
