import type { UserRole } from "@/types";

/** Matches backend auth controller JSON shape */
export interface AuthApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthApiSuccess {
  success: true;
  message: string;
  token: string;
  user: AuthApiUser;
}

export interface AuthApiError {
  success: false;
  message: string;
}

export type AuthApiResponse = AuthApiSuccess | AuthApiError;

export interface AuthResult {
  user: AuthApiUser;
  token: string;
  message: string;
}
