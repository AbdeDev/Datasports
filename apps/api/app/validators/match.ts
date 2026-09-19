import vine from "@vinejs/vine";

export const createMatchValidator = vine.compile(
  vine.object({
    homeClubId: vine.number().optional(),
    awayClubId: vine.number().optional(),
    matchDate: vine.date(),
    competition: vine.string().trim().optional(),
    venue: vine.string().trim().optional(),
  }),
);
