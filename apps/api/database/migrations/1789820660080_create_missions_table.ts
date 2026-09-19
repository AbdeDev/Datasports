import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "missions";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("match_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("matches")
        .onDelete("RESTRICT");
      table
        .integer("scout_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("RESTRICT");
      table
        .integer("created_by")
        .unsigned()
        .nullable()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      // Proposée · Acceptée · À venir · Évaluation à compléter · Terminée ·
      // Scout indisponible · À réattribuer · Annulée (brief §10).
      table.string("status").notNullable().defaultTo("proposee");
      table.text("decline_reason").nullable();
      table.timestamp("responded_at").nullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
