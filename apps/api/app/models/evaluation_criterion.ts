import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import EvaluationAnswer from "#models/evaluation_answer";
import EvaluationCategory from "#models/evaluation_category";

export default class EvaluationCriterion extends BaseModel {
  static table = "evaluation_criteria";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare evaluationCategoryId: number;

  @column()
  declare name: string;

  @column()
  declare displayOrder: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => EvaluationCategory)
  declare category: BelongsTo<typeof EvaluationCategory>;

  @hasMany(() => EvaluationAnswer)
  declare answers: HasMany<typeof EvaluationAnswer>;
}
