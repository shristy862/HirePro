import { apiClient } from "@/lib/api/client";

export async function analyzeResume(resumeText: string): Promise<string> {
  const { data } = await apiClient.post<{
    success: boolean;
    analysis: string;
    message?: string;
  }>("/ai/analyze-resume", { resumeText });

  if (!data.success || !data.analysis) {
    throw new Error(data.message || "Failed to analyze resume");
  }

  return data.analysis;
}
