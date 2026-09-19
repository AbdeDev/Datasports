import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Club from "#models/club";
import Observation from "#models/observation";
import PlayerStatusHistory from "#models/player_status_history";

export type PlayerStatus =
  | "decouvert"
  | "a_observer"
  | "suivi"
  | "prioritaire"
  | "prise_de_contact"
  | "contacte"
  | "non_retenu"
  | "archive";

export default class Player extends BaseModel {
  static table = "players";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare firstName: string | null;

  @column()
  declare lastName: string;

  @column.date()
  declare dateOfBirth: DateTime | null;

  @column()
  declare officialPosition: string | null;

  @column()
  declare clubId: number | null;

  @column()
  declare status: PlayerStatus;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => Club)
  declare club: BelongsTo<typeof Club>;

  @hasMany(() => Observation)
  declare observations: HasMany<typeof Observation>;

  @hasMany(() => PlayerStatusHistory)
  declare statusHistory: HasMany<typeof PlayerStatusHistory>;
}
