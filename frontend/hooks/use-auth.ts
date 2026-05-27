"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/context/auth-context";
import { loginWithApi, registerWithApi } from "@/lib/api/auth";
import { getDashboardPath } from "@/lib/auth/routes";
import { getErrorMessage } from "@/lib/utils/errors";
import type { LoginFormValues, SignupFormValues } from "@/validators/auth";

export function useAuth() {
  const router = useRouter();
  const { setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (values: LoginFormValues) => {
      setIsLoading(true);
      try {
        const { user, message } = await loginWithApi(values);
        setUser(user);
        toast.success(message || `Welcome back, ${user.name}!`);
        router.replace(getDashboardPath(user.role));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser]
  );

  const register = useCallback(
    async (values: SignupFormValues) => {
      setIsLoading(true);
      try {
        const { message } = await registerWithApi(values);
        toast.success(
          message || "Account created! Please sign in to continue."
        );
        router.replace("/login");
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser]
  );

  return { login, register, isLoading };
}
