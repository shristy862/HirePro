"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuthContext } from "@/context/auth-context";

interface GuestGuardProps {
  children: React.ReactNode;
}

/** Redirects logged-in users away from login/signup to their dashboard */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, getDashboardPath } = useAuthContext();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (!redirected.current) {
      redirected.current = true;
      router.replace(getDashboardPath());
    }
  }, [isLoading, isAuthenticated, getDashboardPath, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
