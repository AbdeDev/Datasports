import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "evaluation_answers";

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
      table
        .integer("evaluation_criterion_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("evaluation_criteria")
        .onDelete("RESTRICT");
      // 1 Très faible · 2 Faible · 3 Correct · 4 Bon · 5 Excellent (brief §10).
      table.integer("score").notNullable();
      table.text("comment").nullable();

      // Append-only by design (brief §11.1): one row per answer, never
      // aggregated-only. No `updated_at` — an answer is not meant to be
      // edited after the fact, only superseded by a new observation.
      table.timestamp("created_at").notNullable();

      table.unique(["observation_id", "evaluation_criterion_id"]);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
