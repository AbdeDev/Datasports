import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "evaluation_grids";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.string("name").notNullable();
      // Grids are generic so a future goalkeeper grid (out of POC scope,
      // brief §14) fits without a schema rewrite.
      table.string("position_type").notNullable().defaultTo("field_player");
      table.boolean("is_active").notNullable().defaultTo(true);

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
