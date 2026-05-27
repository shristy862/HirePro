import axios, { AxiosError, AxiosResponse } from "axios";

const HF_TOKEN = process.env.HF_TOKEN?.trim();

/** Chat model for router API (better for resume analysis than flan-t5) */
const HF_MODEL =
  process.env.HF_MODEL?.trim() ||
  "meta-llama/Meta-Llama-3.1-8B-Instruct";

const HF_CHAT_URL =
  "https://router.huggingface.co/v1/chat/completions";

const HF_INFERENCE_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

const MAX_RESUME_CHARS = 4000;
const MAX_RETRIES = 4;

if (!HF_TOKEN) {
  console.warn(
    "HF_TOKEN is not set — AI resume analysis will not work."
  );
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const truncateResumeText = (text: string) => {
  if (text.length <= MAX_RESUME_CHARS) return text;
  return `${text.slice(0, MAX_RESUME_CHARS)}\n...[truncated]`;
};

const buildPrompt = (resumeText: string) => `
You are an expert career coach and ATS specialist.

Analyze the resume below. Reply in plain text with these exact headings:

ATS Score: <number>/100

Strengths:
- <bullet points>

Missing Skills:
- <bullet points>

Suggestions:
- <bullet points>

Resume:
${truncateResumeText(resumeText)}
`.trim();

const isNetworkError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  const code = error.code;
  if (
    code === "ENOTFOUND" ||
    code === "EAI_AGAIN" ||
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === "ECONNABORTED"
  ) {
    return true;
  }

  return !error.response;
};

const getModelLoadingDelay = (data: unknown): number | null => {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const error =
    typeof record.error === "string" ? record.error : "";

  if (!error.toLowerCase().includes("loading")) {
    return null;
  }

  const estimated = record.estimated_time;
  if (typeof estimated === "number" && estimated > 0) {
    return Math.min(60_000, estimated * 1000);
  }

  return 15_000;
};

export const extractHfGeneratedText = (
  data: unknown
): string | null => {
  if (!data) return null;

  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed || null;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const text = extractHfGeneratedText(item);
      if (text) return text;
    }
    return null;
  }

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;

    const choices = record.choices;
    if (Array.isArray(choices) && choices[0]) {
      const message = (choices[0] as Record<string, unknown>)
        .message as Record<string, unknown> | undefined;
      if (message && typeof message.content === "string") {
        const trimmed = message.content.trim();
        if (trimmed) return trimmed;
      }
    }

    if (typeof record.generated_text === "string") {
      const trimmed = record.generated_text.trim();
      if (trimmed) return trimmed;
    }

    if (typeof record.error === "string") {
      throw new Error(record.error);
    }
  }

  return null;
};

class HfModelLoadingError extends Error {
  readonly delayMs: number;

  constructor(delayMs: number) {
    super("Hugging Face model is loading");
    this.name = "HfModelLoadingError";
    this.delayMs = delayMs;
  }
}

const getApiErrorMessage = (error: AxiosError): string => {
  const data = error.response?.data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
  }

  return error.message;
};

const postChatCompletion = async (
  prompt: string
): Promise<AxiosResponse<unknown>> => {
  return axios.post<unknown>(
    HF_CHAT_URL,
    {
      model: HF_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      validateStatus: (status) =>
        status === 200 || status === 503,
    }
  );
};

const postInference = async (
  prompt: string
): Promise<AxiosResponse<unknown>> => {
  const customUrl = process.env.HF_API_URL?.trim();
  const url = customUrl || HF_INFERENCE_URL;

  return axios.post<unknown>(
    url,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        return_full_text: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      validateStatus: (status) =>
        status === 200 || status === 503,
    }
  );
};

const parseHfResponse = (
  response: AxiosResponse<unknown>
): string => {
  const loadingDelay = getModelLoadingDelay(response.data);

  if (loadingDelay) {
    throw new HfModelLoadingError(loadingDelay);
  }

  if (response.status !== 200) {
    throw new Error(
      `Hugging Face request failed (${response.status})`
    );
  }

  const text = extractHfGeneratedText(response.data);

  if (text) return text;

  throw new Error(
    "Unexpected Hugging Face response format"
  );
};

export const analyzeResumeAI = async (
  resumeText: string
): Promise<string> => {
  if (!HF_TOKEN) {
    throw new Error("HF_TOKEN is not configured");
  }

  const prompt = buildPrompt(resumeText);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      let response: AxiosResponse<unknown> | null = null;

      try {
        response = await postChatCompletion(prompt);
      } catch (chatError) {
        if (!isNetworkError(chatError)) {
          throw chatError;
        }
        lastError =
          chatError instanceof Error
            ? chatError
            : new Error(String(chatError));

        try {
          response = await postInference(prompt);
        } catch (inferenceError) {
          if (axios.isAxiosError(inferenceError)) {
            throw new Error(getApiErrorMessage(inferenceError));
          }
          throw inferenceError;
        }
      }

      return parseHfResponse(response);
    } catch (error) {
      if (error instanceof HfModelLoadingError) {
        await sleep(error.delayMs);
        continue;
      }

      if (axios.isAxiosError(error)) {
        const loadingDelay = getModelLoadingDelay(
          error.response?.data
        );

        if (loadingDelay) {
          await sleep(loadingDelay);
          lastError = new Error(getApiErrorMessage(error));
          continue;
        }

        throw new Error(getApiErrorMessage(error));
      }

      if (error instanceof Error) {
        lastError = error;
        throw error;
      }

      throw new Error("AI analysis failed");
    }
  }

  throw (
    lastError ??
    new Error(
      "Hugging Face model is still loading — try again in a minute"
    )
  );
};
