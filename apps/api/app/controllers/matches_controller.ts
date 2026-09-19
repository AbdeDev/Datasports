import type { HttpContext } from "@adonisjs/core/http";
import Match from "#models/match";
import { createMatchValidator } from "#validators/match";

export default class MatchesController {
  async index() {
    return Match.query().preload("homeClub").preload("awayClub").orderBy("match_date", "desc");
  }

  async store({ authUser, request, response }: HttpContext) {
    if (authUser.role !== "admin") {
      return response.forbidden({ error: "Only an admin can create a match" });
    }

    const payload = await request.validateUsing(createMatchValidator);
    const match = await Match.create(payload);
    return response.created(match);
  }
}
