"use client";

import { AlertCircle, RefreshCw, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface ProfileApiStatusProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
  className?: string;
}

function getProfileErrorMessage(error: string | null): {
  title: string;
  description: string;
} {
  if (!error) {
    return {
      title: "Could not load profile",
      description: "Something went wrong. Please try again.",
    };
  }

  const lower = error.toLowerCase();

  if (lower.includes("404") || lower.includes("not found")) {
    return {
      title: "Profile service unavailable",
      description:
        "The profile API is not reachable. Restart the backend with npm run dev inside the backend folder, then try again.",
    };
  }

  if (lower.includes("403") || lower.includes("not allowed")) {
    return {
      title: "Access denied",
      description: "Sign in as a job seeker (candidate) account to manage your profile.",
    };
  }

  if (lower.includes("401") || lower.includes("unauthorized")) {
    return {
      title: "Session expired",
      description: "Please sign out and log in again to continue.",
    };
  }

  return {
    title: "Could not load profile",
    description: error,
  };
}

export function ProfileApiStatus({
  loading,
  error,
  onRetry,
  children,
  className,
}: ProfileApiStatusProps) {
  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="h-2 animate-pulse rounded-full bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted/60" />
      </div>
    );
  }

  if (error) {
    const { title, description } = getProfileErrorMessage(error);
    const is404 =
      error.toLowerCase().includes("404") ||
      description.includes("not reachable");

    return (
      <Card
        className={cn(
          "border-amber-500/30 bg-amber-500/5",
          className
        )}
      >
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 gap-3">
            {is404 ? (
              <ServerCrash className="size-8 shrink-0 text-amber-600" />
            ) : (
              <AlertCircle className="size-8 shrink-0 text-amber-600" />
            )}
            <div className="min-w-0">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 cursor-pointer"
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
