import vine from "@vinejs/vine";

export const createObservationValidator = vine.compile(
  vine.object({
    playerId: vine.number(),
    playingTimeMinutes: vine.number().optional(),
    weather: vine.string().trim().optional(),
    pitchCondition: vine.string().trim().optional(),
    observedPositions: vine.array(vine.string().trim()).minLength(1),
    currentLevel: vine.number().min(1).max(5),
    potential: vine.enum(["A+", "A", "B", "C", "D"] as const),
    strengths: vine.array(vine.string().trim()).maxLength(3),
    weaknesses: vine.array(vine.string().trim()).maxLength(3),
    generalComment: vine.string().trim().optional(),
    decision: vine.enum(["suivi", "prioritaire", "prise_de_contact", "non_retenu"] as const),
    answers: vine
      .array(
        vine.object({
          criterionId: vine.number(),
          score: vine.number().min(1).max(5),
          comment: vine.string().trim().optional(),
        }),
      )
      .minLength(1),
  }),
);

export const validateAnalysisValidator = vine.compile(
  vine.object({
    analysisValidated: vine.string().trim().minLength(1),
  }),
);
