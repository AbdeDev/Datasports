import vine from "@vinejs/vine";

export const createMissionValidator = vine.compile(
  vine.object({
    matchId: vine.number(),
    scoutId: vine.number(),
    playerIds: vine.array(vine.number()).minLength(1),
  }),
);

export const respondMissionValidator = vine.compile(
  vine.object({
    decision: vine.enum(["accept", "decline"] as const),
    declineReason: vine.string().trim().optional(),
  }),
);

export const reassignMissionValidator = vine.compile(
  vine.object({
    scoutId: vine.number(),
  }),
);
