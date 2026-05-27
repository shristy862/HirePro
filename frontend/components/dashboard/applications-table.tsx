"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApplicationDetailPath } from "@/constants/applications";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/types/applications";
import { cn } from "@/lib/utils";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  reviewed: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  shortlisted: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

interface ApplicationsTableProps {
  applications: Application[];
  variant?: "recruiter" | "candidate";
}

export function ApplicationsTable({
  applications,
  variant = "recruiter",
}: ApplicationsTableProps) {
  const isCandidate = variant === "candidate";
  const isRecruiter = !isCandidate;

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {isCandidate ? (
              <>
                <TableHead>Job</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
              </>
            ) : (
              <>
                <TableHead>Candidate</TableHead>
                <TableHead className="hidden md:table-cell">Position</TableHead>
              </>
            )}
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Applied</TableHead>
            {isRecruiter && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => {
            const detailHref = getApplicationDetailPath(app.id);

            return (
              <TableRow key={app.id} className="group">
                {isCandidate ? (
                  <>
                    <TableCell>
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="cursor-pointer font-medium transition-colors hover:text-primary"
                      >
                        {app.jobTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {app.company}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {app.location ?? "—"}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <Link
                        href={detailHref}
                        className="cursor-pointer font-medium transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                      >
                        {app.candidateName}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {app.candidateEmail}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Link
                        href={`/jobs/${app.jobId}`}
                        className="cursor-pointer text-sm transition-colors hover:text-primary"
                      >
                        {app.jobTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {app.company}
                      </p>
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize", statusStyles[app.status])}
                  >
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </TableCell>
                {isRecruiter && (
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="cursor-pointer"
                    >
                      <Link href={detailHref}>
                        View application
                        <ArrowRight className="ml-1.5 size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
