import vine from "@vinejs/vine";

export const createClubValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    country: vine.string().trim().optional(),
  }),
);
