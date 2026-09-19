import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Match from "#models/match";
import MissionTarget from "#models/mission_target";
import Observation from "#models/observation";
import User from "#models/user";

export type MissionStatus =
  | "proposee"
  | "acceptee"
  | "a_venir"
  | "evaluation_a_completer"
  | "terminee"
  | "scout_indisponible"
  | "a_reattribuer"
  | "annulee";

export default class Mission extends BaseModel {
  static table = "missions";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare matchId: number;

  @column()
  declare scoutId: number;

  @column()
  declare createdBy: number | null;

  @column()
  declare status: MissionStatus;

  @column()
  declare declineReason: string | null;

  @column.dateTime()
  declare respondedAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => Match)
  declare match: BelongsTo<typeof Match>;

  @belongsTo(() => User, { foreignKey: "scoutId" })
  declare scout: BelongsTo<typeof User>;

  @belongsTo(() => User, { foreignKey: "createdBy" })
  declare creator: BelongsTo<typeof User>;

  @hasMany(() => MissionTarget)
  declare targets: HasMany<typeof MissionTarget>;

  @hasMany(() => Observation)
  declare observations: HasMany<typeof Observation>;
}
