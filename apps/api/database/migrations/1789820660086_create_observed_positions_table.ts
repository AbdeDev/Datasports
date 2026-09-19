import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "observed_positions";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("observation_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("observations")
        .onDelete("CASCADE");
      // Position(s) actually played during the match, from the mini-terrain
      // selector — distinct from the player's official position (brief §10).
      table.string("position").notNullable();

      table.timestamp("created_at").notNullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
