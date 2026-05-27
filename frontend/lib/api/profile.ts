import { apiClient } from "@/lib/api/client";
import type {
  CandidateProfile,
  ProfileCompletion,
  UpdateProfilePayload,
} from "@/types/profile";

interface ProfileUserDocument {
  _id: string;
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
  profileCompletion?: ProfileCompletion["fields"];
  profileCompletePercentage?: number;
  isProfileComplete?: boolean;
}

function mapProfileUser(doc: ProfileUserDocument): CandidateProfile {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    avatar: doc.avatar,
    bio: doc.bio ?? "",
    skills: doc.skills ?? [],
    experience: doc.experience ?? "",
    education: doc.education ?? "",
    linkedin: doc.linkedin ?? "",
    github: doc.github ?? "",
    portfolio: doc.portfolio ?? "",
    resume: doc.resume ?? "",
    profileCompletion: doc.profileCompletion,
    profileCompletePercentage: doc.profileCompletePercentage ?? 0,
    isProfileComplete: doc.isProfileComplete ?? false,
  };
}

export async function fetchMyProfile(): Promise<{
  profile: CandidateProfile;
  completion: ProfileCompletion;
}> {
  const { data } = await apiClient.get<{
    success: boolean;
    user: ProfileUserDocument;
    profileCompletion: ProfileCompletion;
  }>("/profile/me");

  if (!data.success) {
    throw new Error("Failed to load profile");
  }

  return {
    profile: mapProfileUser(data.user),
    completion: data.profileCompletion,
  };
}

export async function updateMyProfile(
  payload: UpdateProfilePayload
): Promise<{
  profile: CandidateProfile;
  completion: ProfileCompletion;
}> {
  const { data } = await apiClient.put<{
    success: boolean;
    message: string;
    user: ProfileUserDocument;
    profileCompletion: ProfileCompletion;
  }>("/profile/update", payload);

  if (!data.success) {
    throw new Error(data.message || "Failed to update profile");
  }

  return {
    profile: mapProfileUser(data.user),
    completion: data.profileCompletion,
  };
}
