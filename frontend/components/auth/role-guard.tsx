"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuthContext } from "@/context/auth-context";
import {
  canAccessPath,
  getAccessDeniedMessage,
  getDashboardPath,
  isAuthPath,
} from "@/lib/auth/routes";

interface RoleGuardProps {
  children: React.ReactNode;
}

export function RoleGuard({ children }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading, role } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !role) {
      if (!isAuthPath(pathname) && !hasRedirected.current) {
        hasRedirected.current = true;
        toast.error("Please sign in to continue");
        router.replace("/login");
      }
      return;
    }

    if (canAccessPath(pathname, role)) {
      hasRedirected.current = false;
      return;
    }

    if (!hasRedirected.current) {
      hasRedirected.current = true;
      toast.info(getAccessDeniedMessage(role, pathname));
      router.replace(getDashboardPath(role));
    }
  }, [isLoading, isAuthenticated, role, pathname, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated || !role) {
    return <AuthLoading />;
  }

  if (!canAccessPath(pathname, role)) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
