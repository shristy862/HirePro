import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  companyName: z.string().min(2, "Company name is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  skills: z.string().min(1, "Add at least one skill (comma-separated)"),
  salary: z
    .string()
    .min(1, "Salary is required")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      "Enter a valid salary amount"
    ),
  experience: z.string().min(1, "Experience level is required"),
  location: z.string().min(2, "Location is required"),
  employmentType: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
  ]),
  status: z.enum(["open", "closed"]).optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export function parseSkillsInput(skills: string): string[] {
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function skillsToInputValue(skills: string[]): string {
  return skills.join(", ");
}
