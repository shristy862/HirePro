import User from "../models/user";
import {
  buildProfileCompletion,
  type ProfileCompletionSummary,
} from "../utils/profileCompletion";

interface UpdateProfilePayload {
  userId: string;
  bio: string | undefined;
  skills: string[] | undefined;
  experience: string | undefined;
  education: string | undefined;
  linkedin: string | undefined;
  github: string | undefined;
  portfolio: string | undefined;
  resume: string | undefined;
}

async function persistProfileCompletion(
  userId: string
): Promise<ProfileCompletionSummary> {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  const completion = buildProfileCompletion(user);

  user.profileCompletion = completion.fields;
  user.profileCompletePercentage = completion.percentage;
  user.isProfileComplete = completion.isComplete;

  await user.save();

  return completion;
}

export async function getAccountProfileService(userId: string) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getMyProfileService(userId: string) {
  await persistProfileCompletion(userId);

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  const completion = buildProfileCompletion(user);

  return { user, completion };
}

export async function updateProfileService({
  userId,
  bio,
  skills,
  experience,
  education,
  linkedin,
  github,
  portfolio,
  resume,
}: UpdateProfilePayload) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      bio,
      skills,
      experience,
      education,
      linkedin,
      github,
      portfolio,
      resume,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  const completion = await persistProfileCompletion(userId);

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return { user, completion };
}
