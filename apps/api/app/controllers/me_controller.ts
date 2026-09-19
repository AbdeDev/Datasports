import type { HttpContext } from "@adonisjs/core/http";

export default class MeController {
  show({ authUser }: HttpContext) {
    return {
      id: authUser.id,
      email: authUser.email,
      fullName: authUser.fullName,
      role: authUser.role,
      createdAt: authUser.createdAt,
    };
  }
}
