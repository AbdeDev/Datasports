import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import EvaluationCriterion from "#models/evaluation_criterion";
import EvaluationGrid from "#models/evaluation_grid";

export default class EvaluationCategory extends BaseModel {
  static table = "evaluation_categories";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare evaluationGridId: number;

  @column()
  declare name: string;

  @column()
  declare displayOrder: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => EvaluationGrid)
  declare grid: BelongsTo<typeof EvaluationGrid>;

  @hasMany(() => EvaluationCriterion)
  declare criteria: HasMany<typeof EvaluationCriterion>;
}
