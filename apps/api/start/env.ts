/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from "@adonisjs/core/env";

export default await Env.create(new URL("../", import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(["development", "production", "test"] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: "host" }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: "url", tld: false }),

  // Database
  DATABASE_URL: Env.schema.string(),

  // Auth (Supabase) — JWKS verification, no secret needed
  SUPABASE_URL: Env.schema.string({ format: "url", tld: false }),

  // CORS (comma-separated allowlist, production only)
  CORS_ORIGIN: Env.schema.string.optional(),
});
