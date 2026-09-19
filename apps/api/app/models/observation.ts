import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import EvaluationAnswer from "#models/evaluation_answer";
import EvaluationGrid from "#models/evaluation_grid";
import Mission from "#models/mission";
import ObservedPosition from "#models/observed_position";
import Player from "#models/player";

export type ObservationDecision = "suivi" | "prioritaire" | "prise_de_contact" | "non_retenu";

export default class Observation extends BaseModel {
  static table = "observations";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare missionId: number;

  @column()
  declare playerId: number;

  @column()
  declare evaluationGridId: number;

  @column()
  declare playingTimeMinutes: number | null;

  @column()
  declare weather: string | null;

  @column()
  declare pitchCondition: string | null;

  @column()
  declare currentLevel: number | null;

  @column()
  declare potential: "A+" | "A" | "B" | "C" | "D" | null;

  @column({ prepare: (value: string[]) => JSON.stringify(value) })
  declare strengths: string[];

  @column({ prepare: (value: string[]) => JSON.stringify(value) })
  declare weaknesses: string[];

  @column()
  declare generalComment: string | null;

  @column()
  declare decision: ObservationDecision | null;

  @column()
  declare analysisGenerated: string | null;

  @column()
  declare analysisValidated: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => Mission)
  declare mission: BelongsTo<typeof Mission>;

  @belongsTo(() => Player)
  declare player: BelongsTo<typeof Player>;

  @belongsTo(() => EvaluationGrid)
  declare grid: BelongsTo<typeof EvaluationGrid>;

  @hasMany(() => ObservedPosition)
  declare observedPositions: HasMany<typeof ObservedPosition>;

  @hasMany(() => EvaluationAnswer)
  declare answers: HasMany<typeof EvaluationAnswer>;
}
