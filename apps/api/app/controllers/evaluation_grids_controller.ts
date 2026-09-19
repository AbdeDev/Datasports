import EvaluationGrid from "#models/evaluation_grid";

export default class EvaluationGridsController {
  async active() {
    return EvaluationGrid.query()
      .where("is_active", true)
      .preload("categories", (categoryQuery) =>
        categoryQuery
          .orderBy("display_order", "asc")
          .preload("criteria", (criterionQuery) => criterionQuery.orderBy("display_order", "asc")),
      )
      .firstOrFail();
  }
}
