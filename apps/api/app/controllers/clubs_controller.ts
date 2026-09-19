import type { HttpContext } from "@adonisjs/core/http";
import Club from "#models/club";
import { createClubValidator } from "#validators/club";

export default class ClubsController {
  async index() {
    return Club.query().orderBy("name", "asc");
  }

  async store({ authUser, request, response }: HttpContext) {
    if (authUser.role !== "admin") {
      return response.forbidden({ error: "Only an admin can create a club" });
    }

    const payload = await request.validateUsing(createClubValidator);
    const club = await Club.create(payload);
    return response.created(club);
  }
}
