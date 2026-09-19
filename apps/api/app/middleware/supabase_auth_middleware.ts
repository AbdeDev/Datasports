import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import { createRemoteJWKSet, jwtVerify } from "jose";
import User from "#models/user";
import env from "#start/env";

const jwks = createRemoteJWKSet(new URL("/auth/v1/.well-known/jwks.json", env.get("SUPABASE_URL")));

/**
 * Verifies the Supabase-issued JWT sent as a Bearer token, then loads (or
 * lazily provisions) the corresponding application user — Supabase only
 * knows the identity, our own `users` table owns the role (see brief §8).
 */
export default class SupabaseAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return ctx.response.unauthorized({ error: "Missing bearer token" });
    }

    let supabaseUserId: string;
    let email: string;

    try {
      const { payload } = await jwtVerify(token, jwks, { algorithms: ["ES256"] });

      if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
        return ctx.response.unauthorized({ error: "Invalid token payload" });
      }

      supabaseUserId = payload.sub;
      email = payload.email;
    } catch {
      return ctx.response.unauthorized({ error: "Invalid or expired token" });
    }

    let user = await User.findBy("supabaseUserId", supabaseUserId);

    if (!user) {
      user = await User.create({ supabaseUserId, email, role: "scout" });
    }

    ctx.authUser = user;

    return next();
  }
}

declare module "@adonisjs/core/http" {
  interface HttpContext {
    authUser: User;
  }
}
