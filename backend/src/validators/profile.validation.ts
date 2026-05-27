import { z } from "zod";

export const updateProfileSchema =
  z.object({

    bio: z.string().optional(),

    skills: z
      .array(z.string())
      .optional(),

    experience:
      z.string().optional(),

    education:
      z.string().optional(),

    linkedin:
      z.string().optional(),

    github:
      z.string().optional(),

    portfolio:
      z.string().optional(),

    resume:
      z.string().optional(),

  });

export type UpdateProfileInput =
  z.infer<
    typeof updateProfileSchema
  >;