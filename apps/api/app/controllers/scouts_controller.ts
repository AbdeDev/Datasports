import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";

export default class ScoutsController {
  async index({ authUser, response }: HttpContext) {
    if (authUser.role !== "admin") {
      return response.forbidden({ error: "Only an admin can list scouts" });
    }

    return User.query().where("role", "scout").orderBy("email", "asc");
  }
}
