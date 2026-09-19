import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "observations";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").notNullable();
      table
        .integer("mission_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("missions")
        .onDelete("RESTRICT");
      table
        .integer("player_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("players")
        .onDelete("RESTRICT");
      table
        .integer("evaluation_grid_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("evaluation_grids")
        .onDelete("RESTRICT");

      table.integer("playing_time_minutes").nullable();
      table.string("weather").nullable();
      table.string("pitch_condition").nullable();

      // Impression globale (brief §10).
      table.integer("current_level").nullable();
      table.string("potential").nullable(); // A+ / A / B / C / D
      table.jsonb("strengths").notNullable().defaultTo("[]"); // max 3
      table.jsonb("weaknesses").notNullable().defaultTo("[]"); // max 3, auto-suggérés
      table.text("general_comment").nullable();

      // Suivi / Prioritaire / Prise de contact / Non retenu (brief §10).
      table.string("decision").nullable();

      // Analyse générée ET analyse validée — les deux versions conservées
      // (brief §11.5), jamais l'une n'écrase l'autre.
      table.text("analysis_generated").nullable();
      table.text("analysis_validated").nullable();

      table.timestamp("created_at").notNullable();
      table.timestamp("updated_at").nullable();
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
