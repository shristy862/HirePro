"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplyJobDialog } from "@/components/applications/apply-job-dialog";
import { useApplications } from "@/context/applications-context";
import { useAuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/jobs";

interface JobApplyButtonProps {
  job: Job;
  className?: string;
  fullWidth?: boolean;
  /** On cards, use compact styling */
  size?: "default" | "sm";
}

export function JobApplyButton({
  job,
  className,
  fullWidth = false,
  size = "default",
}: JobApplyButtonProps) {
  const { hasRole } = useAuthContext();
  const { hasApplied, markApplied, loading } = useApplications();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isCandidate = hasRole("candidate");

  if (!isCandidate) {
    return null;
  }

  const applied = hasApplied(job.id);
  const widthClass = fullWidth ? "flex-1" : "";

  if (applied) {
    return (
      <Button
        variant="secondary"
        disabled
        className={cn(
          widthClass,
          "cursor-default border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
          className
        )}
        size={size === "sm" ? "sm" : "default"}
        aria-label="Already applied to this job"
      >
        <Check className="mr-2 size-4 shrink-0" />
        Applied
      </Button>
    );
  }

  if (job.status !== "open") {
    return null;
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn(widthClass, className)}
        size={size === "sm" ? "sm" : "default"}
      >
        <Loader2 className="mr-2 size-4 animate-spin" />
        …
      </Button>
    );
  }

  if (size === "sm") {
    return (
      <>
        <Button
          type="button"
          className={cn(
            widthClass,
            "bg-gradient-to-r from-violet-600 to-indigo-600",
            className
          )}
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          Apply
        </Button>
        <ApplyJobDialog
          job={job}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => markApplied(job.id)}
        />
      </>
    );
  }

  return (
    <>
      <Button
        type="button"
        className={cn(
          widthClass,
          "bg-gradient-to-r from-violet-600 to-indigo-600",
          className
        )}
        onClick={() => setDialogOpen(true)}
      >
        Apply now
      </Button>
      <ApplyJobDialog
        job={job}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => markApplied(job.id)}
      />
    </>
  );
}
