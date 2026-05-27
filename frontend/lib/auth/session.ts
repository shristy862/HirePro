import { setAuthToken } from "@/lib/api/client";
import type { AuthApiUser } from "@/types/auth";
import type { User } from "@/types";

export function mapApiUserToUser(apiUser: AuthApiUser): User {
  return {
    id: String(apiUser.id),
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    avatar: apiUser.avatar,
  };
}

export function persistAuthSession(token: string, apiUser: AuthApiUser): User {
  const user = mapApiUserToUser(apiUser);
  setAuthToken(token);

  if (typeof window !== "undefined") {
    localStorage.setItem("hireflow-user", JSON.stringify(user));
  }

  return user;
}

export function updateStoredUser(patch: Partial<User>): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("hireflow-user");
  if (!raw) return null;

  try {
    const current = JSON.parse(raw) as User;
    const next = { ...current, ...patch };
    localStorage.setItem("hireflow-user", JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  setAuthToken(null);

  if (typeof window !== "undefined") {
    localStorage.removeItem("hireflow-user");
    localStorage.removeItem("hireflow-role");
  }
}
