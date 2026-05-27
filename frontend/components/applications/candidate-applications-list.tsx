"use client";

import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/types/applications";
import { cn } from "@/lib/utils";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  reviewed:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  shortlisted:
    "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

interface CandidateApplicationsListProps {
  applications: Application[];
  compact?: boolean;
}

export function CandidateApplicationsList({
  applications,
  compact = false,
}: CandidateApplicationsListProps) {
  return (
    <div className={cn("space-y-3", compact && "space-y-2")}>
      {applications.map((app) => (
        <Card
          key={app.id}
          className="transition-colors hover:border-violet-500/30"
        >
          <CardContent
            className={cn("flex flex-col gap-3 py-4", compact && "py-3")}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/jobs/${app.jobId}`}
                  className="cursor-pointer font-semibold transition-colors hover:text-primary"
                >
                  {app.jobTitle}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5 shrink-0" />
                    {app.company}
                  </span>
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 shrink-0" />
                      {app.location}
                    </span>
                  )}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("shrink-0 capitalize", statusStyles[app.status])}
              >
                {APPLICATION_STATUS_LABELS[app.status]}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Applied {new Date(app.appliedAt).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm" className="h-7 px-2" asChild>
                <Link href={`/jobs/${app.jobId}`}>
                  View job
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
