/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";

router.get("/", () => {
  return { hello: "world" };
});

router.get("/health", () => {
  return { status: "ok" };
});

router
  .group(() => {
    router.get("me", "#controllers/me_controller.show").use(middleware.auth());
  })
  .prefix("/api/v1");
