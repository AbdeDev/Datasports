import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "matches";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("home_club_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("clubs")
        .onDelete("SET NULL");
      table
        .integer("away_club_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("clubs")
        .onDelete("SET NULL");
      table.timestamp("match_date").notNullable();
      table.string("competition").nullable();
      table.string("venue").nullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
