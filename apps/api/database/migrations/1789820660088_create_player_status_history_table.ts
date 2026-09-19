import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "player_status_history";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("player_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("players")
        .onDelete("CASCADE");
      table.string("status").notNullable();
      table
        .integer("changed_by")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table.text("note").nullable();

      // Append-only (brief §11.3): every player status change is historized,
      // never overwritten.
      table.timestamp("created_at").notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
