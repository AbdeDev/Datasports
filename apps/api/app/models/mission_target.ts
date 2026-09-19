import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Mission from "#models/mission";
import Player from "#models/player";

export default class MissionTarget extends BaseModel {
  static table = "mission_targets";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare missionId: number;

  @column()
  declare playerId: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @belongsTo(() => Mission)
  declare mission: BelongsTo<typeof Mission>;

  @belongsTo(() => Player)
  declare player: BelongsTo<typeof Player>;
}
