import type { HttpContext } from "@adonisjs/core/http";
import ObservationService, {
  ObservationConflictError,
  ObservationForbiddenError,
} from "#services/observation_service";
import { createObservationValidator } from "#validators/observation";

const observationService = new ObservationService();

export default class ObservationsController {
  async store({ authUser, params, request, response }: HttpContext) {
    if (authUser.role !== "scout") {
      return response.forbidden({ error: "Only a scout can submit an observation" });
    }

    const payload = await request.validateUsing(createObservationValidator);

    try {
      const observation = await observationService.create(Number(params.id), authUser, payload);
      return response.created(observation);
    } catch (error) {
      if (error instanceof ObservationForbiddenError) {
        return response.forbidden({ error: error.message });
      }
      if (error instanceof ObservationConflictError) {
        return response.conflict({ error: error.message });
      }
      throw error;
    }
  }
}
