import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import EvaluationCriterion from "#models/evaluation_criterion";
import Observation from "#models/observation";

export default class EvaluationAnswer extends BaseModel {
  static table = "evaluation_answers";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare observationId: number;

  @column()
  declare evaluationCriterionId: number;

  @column()
  declare score: number;

  @column()
  declare comment: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @belongsTo(() => Observation)
  declare observation: BelongsTo<typeof Observation>;

  @belongsTo(() => EvaluationCriterion, { foreignKey: "evaluationCriterionId" })
  declare criterion: BelongsTo<typeof EvaluationCriterion>;
}
