import type { HttpContext } from "@adonisjs/core/http";
import ObservationService, {
  ObservationConflictError,
  ObservationForbiddenError,
} from "#services/observation_service";
import { createObservationValidator, validateAnalysisValidator } from "#validators/observation";

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

  async validateAnalysis({ authUser, params, request, response }: HttpContext) {
    if (authUser.role !== "scout") {
      return response.forbidden({ error: "Only a scout can validate an analysis" });
    }

    const { analysisValidated } = await request.validateUsing(validateAnalysisValidator);

    try {
      const observation = await observationService.validateAnalysis(
        Number(params.id),
        authUser,
        analysisValidated,
      );
      return response.ok(observation);
    } catch (error) {
      if (error instanceof ObservationForbiddenError) {
        return response.forbidden({ error: error.message });
      }
      throw error;
    }
  }
}
