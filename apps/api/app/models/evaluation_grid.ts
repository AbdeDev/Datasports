import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import EvaluationCategory from "#models/evaluation_category";

export default class EvaluationGrid extends BaseModel {
  static table = "evaluation_grids";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare positionType: "field_player" | "goalkeeper";

  @column()
  declare isActive: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @hasMany(() => EvaluationCategory)
  declare categories: HasMany<typeof EvaluationCategory>;
}
