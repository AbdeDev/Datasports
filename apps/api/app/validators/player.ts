import vine from "@vinejs/vine";

// firstName is optional on purpose: brief §10 "+ Joueur repéré" allows quick
// creation with partial info during a match (e.g. "N°7 — Paris FC U16 — AD").
export const createPlayerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().optional(),
    lastName: vine.string().trim().minLength(1),
    dateOfBirth: vine.date().optional(),
    officialPosition: vine.string().trim().optional(),
    clubId: vine.number().optional(),
  }),
);
