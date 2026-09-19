import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "evaluation_categories";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("evaluation_grid_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("evaluation_grids")
        .onDelete("CASCADE");
      table.string("name").notNullable();
      table.integer("display_order").notNullable().defaultTo(0);

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
