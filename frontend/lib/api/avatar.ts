import { apiClient } from "@/lib/api/client";

export async function fetchAvatarPath(): Promise<string | null> {
  const { data } = await apiClient.get<{
    success: boolean;
    user: { avatar?: string };
  }>("/profile/account");

  if (!data.success) {
    throw new Error("Failed to load profile picture");
  }

  return data.user.avatar?.trim() || null;
}

export async function uploadAvatarFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    avatar?: string;
  }>("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to upload profile picture");
  }

  const path = data.avatar?.trim();
  if (!path) {
    throw new Error("Upload succeeded but no avatar URL returned");
  }

  return path;
}
