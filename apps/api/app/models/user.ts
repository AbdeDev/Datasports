import { BaseModel, column } from "@adonisjs/lucid/orm";
import type { DateTime } from "luxon";

export type UserRole = "scout" | "admin";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare supabaseUserId: string;

  @column()
  declare email: string;

  @column()
  declare fullName: string | null;

  @column()
  declare role: UserRole;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;
}
