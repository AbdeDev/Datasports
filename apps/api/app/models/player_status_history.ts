import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Player from "#models/player";
import type { PlayerStatus } from "#models/player";
import User from "#models/user";

export default class PlayerStatusHistory extends BaseModel {
  static table = "player_status_history";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare playerId: number;

  @column()
  declare status: PlayerStatus;

  @column()
  declare changedBy: number | null;

  @column()
  declare note: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @belongsTo(() => Player)
  declare player: BelongsTo<typeof Player>;

  @belongsTo(() => User, { foreignKey: "changedBy" })
  declare changedByUser: BelongsTo<typeof User>;
}
