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
        router.post(":id/withdraw", "#controllers/missions_controller.withdraw");
        router.post(":id/cancel", "#controllers/missions_controller.cancel");
        router.post(":id/targets", "#controllers/missions_controller.addSpottedPlayer");
      })
      .prefix("missions");

    router
      .group(() => {
        router.get("/", "#controllers/clubs_controller.index");
        router.post("/", "#controllers/clubs_controller.store");
      })
      .prefix("clubs");

    router
      .group(() => {
        router.get("/", "#controllers/players_controller.index");
        router.get(":id", "#controllers/players_controller.show");
        router.post("/", "#controllers/players_controller.store");
      })
      .prefix("players");

    router
      .group(() => {
        router.get("/", "#controllers/matches_controller.index");
        router.post("/", "#controllers/matches_controller.store");
      })
      .prefix("matches");

    router.get("scouts", "#controllers/scouts_controller.index");
  })
  .prefix("/api/v1")
  .use(middleware.auth());
