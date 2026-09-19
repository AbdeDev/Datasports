import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "mission_targets";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("mission_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("missions")
        .onDelete("CASCADE");
      table
        .integer("player_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("players")
        .onDelete("CASCADE");

      table.timestamp("created_at").notNullable();

      table.unique(["mission_id", "player_id"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
