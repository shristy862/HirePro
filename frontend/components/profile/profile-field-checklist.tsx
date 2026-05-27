"use client";

import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROFILE_FIELD_KEYS,
  PROFILE_FIELD_LABELS,
  type ProfileCompletionField,
} from "@/types/profile";

const FIELD_ANCHORS: Record<ProfileCompletionField, string> = {
  bio: "#profile-bio",
  skills: "#profile-skills",
  experience: "#profile-experience",
  education: "#profile-education",
  linkedin: "#profile-linkedin",
  github: "#profile-github",
  portfolio: "#profile-portfolio",
  resume: "#profile-resume",
};

interface ProfileFieldChecklistProps {
  fields: Record<ProfileCompletionField, boolean>;
  className?: string;
}

export function ProfileFieldChecklist({
  fields,
  className,
}: ProfileFieldChecklistProps) {
  return (
    <ul className={cn("grid gap-2 sm:grid-cols-2", className)}>
      {PROFILE_FIELD_KEYS.map((field) => {
        const done = fields[field];
        return (
          <li key={field}>
            <Link
              href={FIELD_ANCHORS[field]}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/60",
                done
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-100"
                  : "border-dashed"
              )}
            >
              {done ? (
                <Check className="size-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className={done ? "font-medium" : ""}>
                {PROFILE_FIELD_LABELS[field]}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
