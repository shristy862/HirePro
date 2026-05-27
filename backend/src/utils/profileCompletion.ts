import type { IUser } from "../models/user";

export const PROFILE_COMPLETION_FIELDS = [
  "bio",
  "skills",
  "experience",
  "education",
  "linkedin",
  "github",
  "portfolio",
  "resume",
] as const;

export type ProfileCompletionField =
  (typeof PROFILE_COMPLETION_FIELDS)[number];

export type ProfileCompletionFlags = Record<
  ProfileCompletionField,
  boolean
>;

export interface ProfileCompletionSummary {
  fields: ProfileCompletionFlags;
  percentage: number;
  isComplete: boolean;
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isProfileFieldComplete(
  user: Pick<IUser, ProfileCompletionField>,
  field: ProfileCompletionField
): boolean {
  switch (field) {
    case "skills":
      return Array.isArray(user.skills) && user.skills.length > 0;
    case "bio":
    case "experience":
    case "education":
    case "linkedin":
    case "github":
    case "portfolio":
    case "resume":
      return isNonEmptyString(user[field]);
    default:
      return false;
  }
}

export function buildProfileCompletion(
  user: Pick<IUser, ProfileCompletionField>
): ProfileCompletionSummary {
  const fields = {} as ProfileCompletionFlags;

  for (const field of PROFILE_COMPLETION_FIELDS) {
    fields[field] = isProfileFieldComplete(user, field);
  }

  const completedCount = PROFILE_COMPLETION_FIELDS.filter(
    (field) => fields[field]
  ).length;

  const percentage = Math.round(
    (completedCount / PROFILE_COMPLETION_FIELDS.length) * 100
  );

  return {
    fields,
    percentage,
    isComplete: percentage === 100,
  };
}
