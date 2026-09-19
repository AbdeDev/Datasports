import EvaluationAnswer from "#models/evaluation_answer";
import EvaluationCriterion from "#models/evaluation_criterion";
import EvaluationGrid from "#models/evaluation_grid";
import Mission from "#models/mission";
import MissionTarget from "#models/mission_target";
import Observation, { type ObservationDecision } from "#models/observation";
import ObservedPosition from "#models/observed_position";
import Player, { type PlayerStatus } from "#models/player";
import PlayerStatusHistory from "#models/player_status_history";
import type User from "#models/user";

export class ObservationForbiddenError extends Error {}
export class ObservationConflictError extends Error {}

const decisionToPlayerStatus: Record<ObservationDecision, PlayerStatus> = {
  suivi: "suivi",
  prioritaire: "prioritaire",
  prise_de_contact: "prise_de_contact",
  non_retenu: "non_retenu",
};

type CreateObservationInput = {
  playerId: number;
  playingTimeMinutes?: number;
  weather?: string;
  pitchCondition?: string;
  observedPositions: string[];
  currentLevel: number;
  potential: "A+" | "A" | "B" | "C" | "D";
  strengths: string[];
  weaknesses: string[];
  generalComment?: string;
  decision: ObservationDecision;
  answers: { criterionId: number; score: number; comment?: string }[];
};

export default class ObservationService {
  async create(missionId: number, scout: User, data: CreateObservationInput) {
    const mission = await Mission.findOrFail(missionId);

    if (mission.scoutId !== scout.id) {
      throw new ObservationForbiddenError("This mission does not belong to you");
    }

    if (mission.status !== "acceptee") {
      throw new ObservationConflictError("Only an accepted mission can be evaluated");
    }

    const isTarget = await MissionTarget.query()
      .where("mission_id", mission.id)
      .where("player_id", data.playerId)
      .first();
    if (!isTarget) {
      throw new ObservationConflictError("This player is not targeted by this mission");
    }

    const grid = await EvaluationGrid.query().where("is_active", true).firstOrFail();

    const criteria = await EvaluationCriterion.query().whereHas("category", (categoryQuery) =>
      categoryQuery.where("evaluation_grid_id", grid.id),
    );
    const criterionIds = new Set(criteria.map((c) => c.id));
    for (const answer of data.answers) {
      if (!criterionIds.has(answer.criterionId)) {
        throw new ObservationConflictError("Unknown evaluation criterion");
      }
    }

    const observation = await Observation.create({
      missionId: mission.id,
      playerId: data.playerId,
      evaluationGridId: grid.id,
      playingTimeMinutes: data.playingTimeMinutes ?? null,
      weather: data.weather ?? null,
      pitchCondition: data.pitchCondition ?? null,
      currentLevel: data.currentLevel,
      potential: data.potential,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      generalComment: data.generalComment ?? null,
      decision: data.decision,
    });

    await ObservedPosition.createMany(
      data.observedPositions.map((position) => ({ observationId: observation.id, position })),
    );

    await EvaluationAnswer.createMany(
      data.answers.map((answer) => ({
        observationId: observation.id,
        evaluationCriterionId: answer.criterionId,
        score: answer.score,
        comment: answer.comment ?? null,
      })),
    );

    // Submitting the evaluation completes the mission (brief §10 status flow).
    mission.status = "terminee";
    await mission.save();

    // The decision drives the player's status, historized (brief §11.3).
    const player = await Player.findOrFail(data.playerId);
    const newStatus = decisionToPlayerStatus[data.decision];
    if (player.status !== newStatus) {
      player.status = newStatus;
      await player.save();
      await PlayerStatusHistory.create({
        playerId: player.id,
        status: newStatus,
        changedBy: scout.id,
        note: "Suite à une observation",
      });
    }

    return Observation.query()
      .where("id", observation.id)
      .preload("observedPositions")
      .preload("answers", (answerQuery) => answerQuery.preload("criterion"))
      .firstOrFail();
  }
}
