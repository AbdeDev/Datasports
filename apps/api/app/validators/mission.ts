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

export const withdrawMissionValidator = vine.compile(
  vine.object({
    reason: vine.string().trim().optional(),
  }),
);

export const cancelMissionValidator = vine.compile(
  vine.object({
    reason: vine.string().trim().optional(),
  }),
);

// Unlike the brief's default (partial info allowed), the user wants every
// field required for a spotted player: nom, prénom, poste, club.
export const addSpottedPlayerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
    officialPosition: vine.string().trim().minLength(1),
    clubId: vine.number(),
  }),
);
