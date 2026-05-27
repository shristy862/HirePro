"use client";

import type { ComponentType } from "react";
import { useAuthContext } from "@/context/auth-context";
import { AuthLoading } from "@/components/auth/auth-loading";
import { AccessDenied } from "@/components/auth/access-denied";
import { getDashboardPath } from "@/lib/auth/routes";
import { formatUserRole } from "@/lib/utils/format-role";
import type { UserRole } from "@/types";

export interface WithRoleOptions {
  allowedRoles: UserRole[];
  /** Custom fallback instead of default AccessDenied card */
  fallback?: React.ReactNode;
}

/**
 * HOC — wraps a page/component so only allowed roles can render it.
 * Use together with RoleGuard on the dashboard layout for route-level protection.
 */
export function withRole<P extends object>(
  Component: ComponentType<P>,
  options: WithRoleOptions
) {
  const { allowedRoles, fallback } = options;

  function RoleProtectedComponent(props: P) {
    const { user, isLoading, hasRole } = useAuthContext();

    if (isLoading) {
      return <AuthLoading />;
    }

    if (!user || !hasRole(allowedRoles)) {
      if (fallback) return <>{fallback}</>;

      const role = user?.role ?? "candidate";
      return (
        <AccessDenied
          title="You can't open this page"
          description={`This section is for ${allowedRoles.map(formatUserRole).join(" & ")} only.`}
          dashboardHref={getDashboardPath(role)}
          dashboardLabel={`${formatUserRole(role)} dashboard`}
        />
      );
    }

    return <Component {...props} />;
  }

  RoleProtectedComponent.displayName = `withRole(${
    Component.displayName ?? Component.name ?? "Component"
  })`;

  return RoleProtectedComponent;
}
