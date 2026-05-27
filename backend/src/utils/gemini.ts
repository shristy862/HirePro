import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
  console.warn(
    "GEMINI_API_KEY is not set — AI resume analysis will not work."
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MODEL_ID =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

export async function generateWithGemini(
  prompt: string
): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: MODEL_ID });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text?.trim()) {
    throw new Error("Empty response from Gemini");
  }

  return text.trim();
}
