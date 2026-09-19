import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "users";

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("password");
      table.uuid("supabase_user_id").nullable().unique();
      table.string("role").notNullable().defaultTo("scout");
    });
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("password").notNullable().defaultTo("");
      table.dropColumn("supabase_user_id");
      table.dropColumn("role");
    });
  }
}
