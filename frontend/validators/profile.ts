import { z } from "zod";

function optionalUrl(message: string) {
  return z.string().refine(
    (val) => !val.trim() || /^https?:\/\/.+/i.test(val.trim()),
    message
  );
}

export const candidateProfileSchema = z.object({
  bio: z.string().max(1000, "Bio must be under 1000 characters"),
  skills: z.string(),
  experience: z.string(),
  education: z.string(),
  linkedin: optionalUrl("Enter a valid LinkedIn URL"),
  github: optionalUrl("Enter a valid GitHub URL"),
  portfolio: optionalUrl("Enter a valid portfolio URL"),
});

export type CandidateProfileFormValues = z.infer<
  typeof candidateProfileSchema
>;

export function skillsToInput(skills: string[]): string {
  return skills.join(", ");
}

export function parseSkillsInput(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
