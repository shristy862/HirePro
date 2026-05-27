import { apiClient } from "@/lib/api/client";
import { persistAuthSession } from "@/lib/auth/session";
import type { AuthApiResponse, AuthResult } from "@/types/auth";
import type { LoginFormValues, SignupFormValues } from "@/validators/auth";
import type { User } from "@/types";

function assertAuthSuccess(response: AuthApiResponse): AuthResult {
  if (!response.success) {
    throw new Error(response.message);
  }

  return {
    user: response.user,
    token: response.token,
    message: response.message,
  };
}

export async function loginWithApi(
  credentials: LoginFormValues
): Promise<{ user: User; message: string }> {
  const { data } = await apiClient.post<AuthApiResponse>(
    "/auth/login",
    credentials
  );

  const { user: apiUser, token, message } = assertAuthSuccess(data);
  const user = persistAuthSession(token, apiUser);

  return { user, message };
}

export async function registerWithApi(
  payload: SignupFormValues
): Promise<{ message: string }> {
  const { name, email, password, role } = payload;

  const { data } = await apiClient.post<AuthApiResponse>("/auth/register", {
    name,
    email,
    password,
    role,
  });

  if (!data.success) {
    throw new Error(data.message);
  }

  return { message: data.message };
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("hireflow-user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export { clearAuthSession as logoutUser } from "@/lib/auth/session";
