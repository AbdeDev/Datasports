import { BaseModel, belongsTo, column, hasMany } from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Club from "#models/club";
import Mission from "#models/mission";

export default class Match extends BaseModel {
  static table = "matches";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare homeClubId: number | null;

  @column()
  declare awayClubId: number | null;

  @column.dateTime()
  declare matchDate: DateTime;

  @column()
  declare competition: string | null;

  @column()
  declare venue: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @belongsTo(() => Club, { foreignKey: "homeClubId" })
  declare homeClub: BelongsTo<typeof Club>;

  @belongsTo(() => Club, { foreignKey: "awayClubId" })
  declare awayClub: BelongsTo<typeof Club>;

  @hasMany(() => Mission)
  declare missions: HasMany<typeof Mission>;
}
