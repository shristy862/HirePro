import type { UserRole } from "@/types";

export const PUBLIC_PATHS = ["/", "/login", "/signup"] as const;

export const AUTH_PATHS = ["/login", "/signup"] as const;

export const DASHBOARD_PATH: Record<UserRole, string> = {
  recruiter: "/recruiter",
  candidate: "/candidate",
};

/** Routes restricted to specific roles (prefix match) */
export const ROLE_RESTRICTED_ROUTES: {
  prefix: string;
  roles: UserRole[];
}[] = [
  { prefix: "/recruiter", roles: ["recruiter"] },
  { prefix: "/candidate", roles: ["candidate"] },
  { prefix: "/saved-jobs", roles: ["candidate"] },
  { prefix: "/ai", roles: ["candidate"] },
];

export const SHARED_DASHBOARD_PREFIXES = [
  "/jobs",
  "/applications",
  "/settings",
  "/saved-jobs",
] as const;

export function getDashboardPath(role: UserRole): string {
  return DASHBOARD_PATH[role];
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.includes(pathname as (typeof AUTH_PATHS)[number]);
}

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname as (typeof PUBLIC_PATHS)[number]);
}

export function isDashboardPath(pathname: string): boolean {
  return (
    pathname.startsWith("/recruiter") ||
    pathname.startsWith("/candidate") ||
    SHARED_DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

export function canAccessPath(pathname: string, role: UserRole): boolean {
  const restricted = ROLE_RESTRICTED_ROUTES.find((r) =>
    pathname.startsWith(r.prefix)
  );

  if (restricted) {
    return restricted.roles.includes(role);
  }

  if (isDashboardPath(pathname)) {
    return true;
  }

  return false;
}

export function getAccessDeniedMessage(
  role: UserRole,
  pathname?: string
): string {
  if (pathname?.startsWith("/saved-jobs")) {
    return role === "recruiter"
      ? "Saved jobs are only available for job seekers."
      : "You don't have access to this page.";
  }

  return role === "recruiter"
    ? "This area is for candidates. Taking you to your recruiter dashboard."
    : "This area is for job seekers. Taking you to your dashboard.";
}
