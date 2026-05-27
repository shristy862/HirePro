import { z } from "zod";

export const applyJobSchema = z.object({
  resume: z.string().optional(),

  coverLetter: z
    .string()
    .min(10, "Cover letter too short"),
});

export type ApplyJobInput =
  z.infer<typeof applyJobSchema>;