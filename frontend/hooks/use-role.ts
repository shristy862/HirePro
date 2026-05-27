"use client";

import { useAuthContext } from "@/context/auth-context";
import type { UserRole } from "@/types";

/** Convenience hook for role checks in any client component */
export function useRole() {
  const { user, role, hasRole, isAuthenticated } = useAuthContext();

  return {
    user,
    role,
    isRecruiter: hasRole("recruiter"),
    isCandidate: hasRole("candidate"),
    hasRole: (roles: UserRole | UserRole[]) => hasRole(roles),
    isAuthenticated,
  };
}
