"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { withRole } from "@/components/auth/with-role";
import { RecruiterApplicationDetail } from "@/components/applications/recruiter-application-detail";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import {
  fetchRecruiterApplicationById,
  mergeRecruiterApplication,
} from "@/lib/api/applications";
import { useApplications } from "@/hooks/use-applications";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Application } from "@/types/applications";

function RecruiterApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  const { updateApplicationStatus } = useApplications();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplication = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRecruiterApplicationById(applicationId);
      setApplication(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setApplication(null);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    void loadApplication();
  }, [loadApplication]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !application) {
    return (
      <EmptyState
        icon={FileText}
        title="Application not found"
        description={error ?? "This application may have been removed."}
        action={{
          label: "Back to applications",
          onClick: () => router.push("/applications"),
        }}
        className="py-16"
      />
    );
  }

  return (
    <RecruiterApplicationDetail
      application={application}
      onStatusChange={updateApplicationStatus}
      onApplicationUpdated={(updated) =>
        setApplication((prev) =>
          prev ? mergeRecruiterApplication(prev, updated) : updated
        )
      }
    />
  );
}

export default withRole(RecruiterApplicationDetailPage, {
  allowedRoles: ["recruiter"],
});
