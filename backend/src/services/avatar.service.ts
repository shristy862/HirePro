import User from "../models/user";

export async function uploadAvatarService(
  userId: string,
  avatarUrl: string
) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
}

export async function getAvatarService(userId: string) {
  const user = await User.findById(userId).select("avatar");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
