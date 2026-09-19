import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "players";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table.string("first_name").nullable();
      table.string("last_name").notNullable();
      table.date("date_of_birth").nullable();
      // Official registered position — distinct from positions actually
      // observed during a match (see `observed_positions`, brief §10/§13).
      table.string("official_position").nullable();
      table
        .integer("club_id")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("clubs")
        .onDelete("SET NULL");
      // Découvert → À observer → Suivi → Prioritaire → Prise de contact →
      // Contacté, ou Non retenu / Archivé (brief §10). Current status —
      // every transition is also appended to `player_status_history`.
      table.string("status").notNullable().defaultTo("decouvert");

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
