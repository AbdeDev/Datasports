# Build context = repo root (needed for the Bun workspace: root package.json + bun.lock)

# ---- Builder ----
FROM node:26-slim AS builder

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates unzip \
  && curl -fsSL https://bun.sh/install | bash \
  && apt-get purge -y curl unzip \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /repo
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
RUN bun install --frozen-lockfile --ignore-scripts

COPY apps/api apps/api
WORKDIR /repo/apps/api
RUN bun run build

WORKDIR /repo/apps/api/build
RUN bun install --production --ignore-scripts

# ---- Runner ----
FROM node:26-slim AS runner
WORKDIR /app
COPY --from=builder /repo/apps/api/build ./

ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "bin/server.js"]
