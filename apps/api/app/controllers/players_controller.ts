import type { HttpContext } from "@adonisjs/core/http";
import Player from "#models/player";
import { createPlayerValidator } from "#validators/player";

export default class PlayersController {
  async index({ request }: HttpContext) {
    const status = request.input("status");
    const query = Player.query().preload("club").orderBy("last_name", "asc");

    if (status) {
      query.where("status", status);
    }

    return query;
  }

  async show({ params }: HttpContext) {
    return Player.query()
      .where("id", params.id)
      .preload("club")
      .preload("statusHistory", (q) => q.orderBy("created_at", "asc"))
      .firstOrFail();
  }

  // Any authenticated scout or admin can create a player — brief §10
  // "+ Joueur repéré": quick creation with partial info during a match.
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPlayerValidator);
    const player = await Player.create({ ...payload, status: "decouvert" });
    return response.created(player);
  }
}
