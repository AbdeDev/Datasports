import { BaseSeeder } from "@adonisjs/lucid/seeders";
import EvaluationCategory from "#models/evaluation_category";
import EvaluationCriterion from "#models/evaluation_criterion";
import EvaluationGrid from "#models/evaluation_grid";

/**
 * Reference data, not demo data: the 25-criteria field-player grid is
 * defined verbatim by the brief (§10). Criteria live in the DB (§11.6) so
 * they aren't hardcoded, but the POC needs this exact grid to exist for
 * the evaluation flow to work at all — there is no admin UI to author a
 * grid from scratch (dynamic grid editing is out of POC scope, §14).
 */
export default class extends BaseSeeder {
  async run() {
    const existing = await EvaluationGrid.query().where("name", "Grille joueur de champ").first();
    if (existing) {
      return;
    }

    const grid = await EvaluationGrid.create({
      name: "Grille joueur de champ",
      positionType: "field_player",
      isActive: true,
    });

    const categoriesData: Record<string, string[]> = {
      Technique: [
        "Première touche",
        "Conduite de balle",
        "Passe",
        "Tir",
        "Centre",
        "Jeu de tête",
        "Technique globale",
      ],
      Mental: [
        "Concentration",
        "Prise d'information",
        "Prise de décision",
        "Courage",
        "Confiance en soi",
        "Apprentissage",
      ],
      Physique: [
        "Vitesse",
        "Endurance",
        "Puissance",
        "Agilité",
        "Équilibre",
        "Adaptation",
        "Coordination",
        "Détente",
      ],
      "Comportement & attitude": [
        "Attitude entraînement/match",
        "Esprit d'équipe",
        "Respect",
        "Leadership",
      ],
    };

    let categoryOrder = 0;
    for (const [categoryName, criteriaNames] of Object.entries(categoriesData)) {
      const category = await EvaluationCategory.create({
        evaluationGridId: grid.id,
        name: categoryName,
        displayOrder: categoryOrder++,
      });
      await EvaluationCriterion.createMany(
        criteriaNames.map((name, index) => ({
          evaluationCategoryId: category.id,
          name,
          displayOrder: index,
        })),
      );
    }
  }
}
