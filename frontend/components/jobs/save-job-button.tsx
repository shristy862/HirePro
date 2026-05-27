"use client";

import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthContext } from "@/context/auth-context";
import { useOptionalSavedJobs } from "@/context/saved-jobs-context";
import { cn } from "@/lib/utils";

interface SaveJobButtonProps {
  jobId: string;
  size?: "sm" | "default";
  className?: string;
}

export function SaveJobButton({
  jobId,
  size = "sm",
  className,
}: SaveJobButtonProps) {
  const { hasRole } = useAuthContext();
  const savedJobsCtx = useOptionalSavedJobs();
  const isCandidate = hasRole("candidate");

  if (!isCandidate || !savedJobsCtx) {
    return null;
  }

  const { isSaved, toggleSave, togglingId } = savedJobsCtx;
  const saved = isSaved(jobId);
  const busy = togglingId === jobId;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleSave(jobId);
  };

  const iconSize = size === "sm" ? "size-4" : "size-5";
  const buttonSize = size === "sm" ? "icon-xs" : "icon-sm";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={buttonSize}
          className={cn(
            "shrink-0 cursor-pointer rounded-full hover:bg-violet-500/10",
            saved && "text-violet-600 hover:text-violet-700 dark:text-violet-400",
            className
          )}
          onClick={handleClick}
          disabled={busy}
          aria-label={saved ? "Remove from saved jobs" : "Save job"}
          aria-pressed={saved}
        >
          {busy ? (
            <Loader2 className={cn(iconSize, "animate-spin")} />
          ) : (
            <Bookmark
              className={cn(iconSize, saved && "fill-current")}
              strokeWidth={saved ? 0 : 2}
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {saved ? "Saved — click to remove" : "Save job"}
      </TooltipContent>
    </Tooltip>
  );
}
