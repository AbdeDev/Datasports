import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Observation from "#models/observation";

export default class ObservedPosition extends BaseModel {
  static table = "observed_positions";

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare observationId: number;

  @column()
  declare position: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @belongsTo(() => Observation)
  declare observation: BelongsTo<typeof Observation>;
}
