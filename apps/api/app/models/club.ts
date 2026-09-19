import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Player from "#models/player";

export default class Club extends BaseModel {
  static table = "clubs";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare name: string;

  @column()
  declare country: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;

  @hasMany(() => Player)
  declare players: HasMany<typeof Player>;
}
