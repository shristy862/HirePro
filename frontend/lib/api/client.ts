import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/lib/api/api-error";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("hireflow-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.message;

    if (status === 429) {
      return Promise.reject(
        new Error(
          apiMessage ??
            "Too many login attempts. Please wait and try again later."
        )
      );
    }

    const message =
      apiMessage ??
      error.message ??
      "Something went wrong. Please try again.";

    return Promise.reject(new ApiError(message, status));
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("hireflow-token", token);
  } else {
    localStorage.removeItem("hireflow-token");
  }
}
