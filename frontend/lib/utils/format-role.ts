import type { UserRole } from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  recruiter: "Recruiter",
  candidate: "Candidate",
};

export function formatUserRole(role?: UserRole | string): string {
  if (!role) return "User";
  return ROLE_LABELS[role as UserRole] ?? role;
}
