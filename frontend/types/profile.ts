export const PROFILE_FIELD_KEYS = [
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
  (typeof PROFILE_FIELD_KEYS)[number];

export type ProfileCompletionFlags = Record<
  ProfileCompletionField,
  boolean
>;

export interface ProfileCompletion {
  fields: ProfileCompletionFlags;
  percentage: number;
  isComplete: boolean;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resume?: string;
  profileCompletion?: ProfileCompletionFlags;
  profileCompletePercentage?: number;
  isProfileComplete?: boolean;
}

export interface UpdateProfilePayload {
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resume?: string;
}

export const PROFILE_FIELD_LABELS: Record<ProfileCompletionField, string> = {
  bio: "Bio",
  skills: "Skills",
  experience: "Work experience",
  education: "Education",
  linkedin: "LinkedIn",
  github: "GitHub",
  portfolio: "Portfolio",
  resume: "Resume link",
};
