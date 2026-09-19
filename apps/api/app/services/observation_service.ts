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

const decisionLabels: Record<ObservationDecision, string> = {
  suivi: "à suivre",
  prioritaire: "prioritaire",
  prise_de_contact: "prise de contact",
  non_retenu: "non retenu",
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

    const criteria = await EvaluationCriterion.query()
      .whereHas("category", (categoryQuery) => categoryQuery.where("evaluation_grid_id", grid.id))
      .preload("category");
    const criteriaById = new Map(criteria.map((criterion) => [criterion.id, criterion]));
    for (const answer of data.answers) {
      if (!criteriaById.has(answer.criterionId)) {
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

    observation.analysisGenerated = this.generateAnalysis(data, criteriaById);
    await observation.save();

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

  /**
   * Rule-based synthesis from the raw answers — no external AI call in the
   * POC. The scout reviews and can rewrite it entirely before validating
   * (brief §11: both the generated and the validated text are kept).
   */
  private generateAnalysis(
    data: CreateObservationInput,
    criteriaById: Map<number, EvaluationCriterion>,
  ): string {
    const scoresByCategory = new Map<string, number[]>();
    for (const answer of data.answers) {
      const categoryName = criteriaById.get(answer.criterionId)?.category.name;
      if (!categoryName) {
        continue;
      }
      const scores = scoresByCategory.get(categoryName) ?? [];
      scores.push(answer.score);
      scoresByCategory.set(categoryName, scores);
    }

    const categoryAverages = [...scoresByCategory.entries()]
      .map(([name, scores]) => ({
        name,
        average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      }))
      .sort((a, b) => b.average - a.average);

    const sentences: string[] = [
      `Niveau actuel évalué à ${data.currentLevel}/5, potentiel ${data.potential}.`,
    ];

    const strongest = categoryAverages[0];
    const weakest = categoryAverages[categoryAverages.length - 1];
    if (strongest && weakest && strongest.name !== weakest.name) {
      sentences.push(
        `Point fort dominant : ${strongest.name} (${strongest.average.toFixed(1)}/5). ` +
          `Axe de progression principal : ${weakest.name} (${weakest.average.toFixed(1)}/5).`,
      );
    }

    if (data.strengths.length > 0) {
      sentences.push(`Qualités relevées : ${data.strengths.join(", ")}.`);
    }
    if (data.weaknesses.length > 0) {
      sentences.push(`Points à travailler : ${data.weaknesses.join(", ")}.`);
    }

    sentences.push(`Décision du scout : ${decisionLabels[data.decision]}.`);

    if (data.generalComment) {
      sentences.push(data.generalComment);
    }

    return sentences.join(" ");
  }

  async validateAnalysis(missionId: number, scout: User, analysisValidated: string) {
    const observation = await Observation.query()
      .where("mission_id", missionId)
      .preload("mission")
      .firstOrFail();

    if (observation.mission.scoutId !== scout.id) {
      throw new ObservationForbiddenError("This observation does not belong to you");
    }

    observation.analysisValidated = analysisValidated;
    await observation.save();

    return observation;
  }
}
