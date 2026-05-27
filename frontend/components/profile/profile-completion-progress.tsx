"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProfileCompletion } from "@/types/profile";

interface ProfileCompletionProgressProps {
  completion: ProfileCompletion;
  variant?: "banner" | "inline";
  className?: string;
}

export function ProfileCompletionProgress({
  completion,
  variant = "banner",
  className,
}: ProfileCompletionProgressProps) {
  const { percentage, isComplete } = completion;

  if (isComplete) {
    return (
      <Card
        className={cn(
          "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/5",
          className
        )}
      >
        <CardContent className="flex items-center gap-3 py-4">
          <CheckCircle2 className="size-8 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              Profile complete
            </p>
            <p className="text-sm text-muted-foreground">
              You&apos;re all set — recruiters can see your full profile.
            </p>
          </div>
          <Sparkles className="size-5 shrink-0 text-emerald-600/80" />
        </CardContent>
      </Card>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Profile completion</span>
          <span className="tabular-nums text-violet-600 dark:text-violet-400">
            {percentage}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Profile ${percentage}% complete`}
          />
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "border-violet-500/25 bg-gradient-to-r from-violet-500/8 to-indigo-500/5",
        className
      )}
    >
      <CardContent className="space-y-4 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-semibold tracking-tight">
              Complete your profile ({percentage}%)
            </p>
            <p className="text-sm text-muted-foreground">
              A stronger profile helps you stand out. Fill in the sections below
              — progress updates as you save.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            <Link href="/settings" className="cursor-pointer">
              Complete profile
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </CardContent>
    </Card>
  );
}
