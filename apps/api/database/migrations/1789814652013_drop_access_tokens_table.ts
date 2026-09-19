import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "auth_access_tokens";

  async up() {
    this.schema.dropTableIfExists(this.tableName);
  }

  async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.integer("tokenable_id").notNullable();
      table.string("type").notNullable();
      table.string("name").nullable();
      table.string("hash").notNullable();
      table.text("abilities").notNullable();
      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").notNullable();
      table.timestamp("last_used_at").nullable();
      table.timestamp("expires_at").nullable();
    });
  }
}
