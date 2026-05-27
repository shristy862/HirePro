"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { RecruiterApplicationsView } from "@/components/applications/recruiter-applications-view";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchJobApplicants } from "@/lib/api/applications";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Application } from "@/types/applications";

interface JobApplicantsSectionProps {
  jobId: string;
}

export function JobApplicantsSection({ jobId }: JobApplicantsSectionProps) {
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobApplicants(jobId);
      setApplicants(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    void loadApplicants();
  }, [loadApplicants]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="size-5 text-violet-600" />
          Applicants
        </CardTitle>
        <CardDescription>
          {loading
            ? "Loading applications…"
            : applicants.length === 0
              ? "No candidates have applied to this role yet."
              : `${applicants.length} candidate${applicants.length === 1 ? "" : "s"} applied — click a name or “View application” to review`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <TableSkeleton rows={3} />
        ) : error ? (
          <EmptyState
            icon={FileText}
            title="Could not load applicants"
            description={error}
            action={{ label: "Retry", onClick: () => void loadApplicants() }}
            className="py-8"
          />
        ) : applicants.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Candidates who apply to this job will appear here."
            className="py-8"
          />
        ) : (
          <RecruiterApplicationsView applications={applicants} />
        )}
      </CardContent>
    </Card>
  );
}
