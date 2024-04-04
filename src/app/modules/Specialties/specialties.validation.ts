import { z } from "zod";

const createSpecialtySchema = z.object({
  title: z.string({
    required_error: "Title is required!",
  }),
});

export const SpecialtiesValidations = {
  createSpecialtySchema,
};
