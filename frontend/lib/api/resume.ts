import { apiClient } from "@/lib/api/client";
import { getUploadPublicUrl } from "@/lib/utils/uploads";

export function getResumePublicUrl(path: string | null | undefined): string | null {
  return getUploadPublicUrl(path);
}

export async function fetchResumePath(): Promise<string | null> {
  const { data } = await apiClient.get<{
    success: boolean;
    resume?: string;
  }>("/resume/me");

  if (!data.success) {
    throw new Error("Failed to load resume");
  }

  return data.resume?.trim() || null;
}

export async function uploadResumeFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await apiClient.post<{
    success: boolean;
    message: string;
    user?: { resume?: string };
  }>("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to upload resume");
  }

  const path = data.user?.resume;
  if (!path) {
    throw new Error("Upload succeeded but no resume URL returned");
  }

  return path;
}
