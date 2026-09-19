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
    router.get("me", "#controllers/me_controller.show");

    router
      .group(() => {
        router.get("/", "#controllers/missions_controller.index");
        router.get(":id", "#controllers/missions_controller.show");
        router.post("/", "#controllers/missions_controller.store");
        router.post(":id/respond", "#controllers/missions_controller.respond");
        router.post(":id/reassign", "#controllers/missions_controller.reassign");
      })
      .prefix("missions");
  })
  .prefix("/api/v1")
  .use(middleware.auth());
