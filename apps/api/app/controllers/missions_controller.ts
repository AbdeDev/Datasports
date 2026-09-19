import type { HttpContext } from "@adonisjs/core/http";
import MissionService, {
  MissionConflictError,
  MissionForbiddenError,
} from "#services/mission_service";
import {
  addSpottedPlayerValidator,
  createMissionValidator,
  reassignMissionValidator,
  respondMissionValidator,
  withdrawMissionValidator,
} from "#validators/mission";

const missionService = new MissionService();

export default class MissionsController {
  async index({ authUser }: HttpContext) {
    const missions = await missionService.listForUser(authUser);
    return missions;
  }

  async show({ authUser, params, response }: HttpContext) {
    try {
      return await missionService.findForUser(Number(params.id), authUser);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async store({ authUser, request, response }: HttpContext) {
    if (authUser.role !== "admin") {
      return response.forbidden({ error: "Only an admin can create a mission" });
    }

    const payload = await request.validateUsing(createMissionValidator);
    const mission = await missionService.create(payload, authUser);
    return response.created(mission);
  }

  async respond({ authUser, params, request, response }: HttpContext) {
    if (authUser.role !== "scout") {
      return response.forbidden({ error: "Only a scout can respond to a mission" });
    }

    const payload = await request.validateUsing(respondMissionValidator);

    try {
      return await missionService.respond(Number(params.id), authUser, payload);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async reassign({ authUser, params, request, response }: HttpContext) {
    if (authUser.role !== "admin") {
      return response.forbidden({ error: "Only an admin can reassign a mission" });
    }

    const payload = await request.validateUsing(reassignMissionValidator);

    try {
      return await missionService.reassign(Number(params.id), payload.scoutId, authUser);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async withdraw({ authUser, params, request, response }: HttpContext) {
    if (authUser.role !== "scout") {
      return response.forbidden({ error: "Only a scout can withdraw from a mission" });
    }

    const payload = await request.validateUsing(withdrawMissionValidator);

    try {
      return await missionService.withdraw(Number(params.id), authUser, payload.reason);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  async addSpottedPlayer({ authUser, params, request, response }: HttpContext) {
    if (authUser.role !== "scout") {
      return response.forbidden({ error: "Only a scout can add a spotted player" });
    }

    const payload = await request.validateUsing(addSpottedPlayerValidator);

    try {
      return await missionService.addSpottedPlayer(Number(params.id), authUser, payload);
    } catch (error) {
      return this.handleError(error, response);
    }
  }

  private handleError(error: unknown, response: HttpContext["response"]) {
    if (error instanceof MissionForbiddenError) {
      return response.forbidden({ error: error.message });
    }
    if (error instanceof MissionConflictError) {
      return response.conflict({ error: error.message });
    }
    throw error;
  }
}
