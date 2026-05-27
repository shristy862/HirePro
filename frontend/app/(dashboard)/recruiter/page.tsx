"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, Sparkles } from "lucide-react";
import { withRole } from "@/components/auth/with-role";
import { PageHeader } from "@/components/shared/page-header";
import { RecruiterStatsGrid } from "@/components/dashboard/recruiter-stats-grid";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { RecruiterApplicationsView } from "@/components/applications/recruiter-applications-view";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRecruiterDashboard } from "@/hooks/use-recruiter-dashboard";
import { RECRUITER_DASHBOARD_LINKS } from "@/constants/recruiter-dashboard";
import { buildPipelineChartData } from "@/lib/utils/dashboard";
import { closeJob } from "@/lib/api/jobs";
import { getErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";

function RecruiterDashboardPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useRecruiterDashboard();

  const openJobs = data?.openJobs ?? [];
  const recentApplications = data?.recentApplications ?? [];
  const pipelineChartData = data
    ? buildPipelineChartData(data.pipeline)
    : [];
  const applicationsTrend = data?.applicationsTrend ?? [];

  const handleCloseJob = async (jobId: string) => {
    try {
      await closeJob(jobId);
      toast.success("Job closed");
      await refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      {error && !loading && (
        <EmptyState
          icon={FileText}
          title="Could not load dashboard"
          description={error}
          action={{
            label: "Retry",
            onClick: () => void refetch(),
          }}
          className="py-8"
        />
      )}

      <PageHeader
        title="Recruiter Dashboard"
        description="Live overview of your jobs and candidate pipeline"
      >
        <Button asChild className="bg-gradient-to-r from-violet-600 to-indigo-600">
          <Link href={RECRUITER_DASHBOARD_LINKS.jobs}>
            <Plus className="mr-2 size-4" />
            Post new job
          </Link>
        </Button>
      </PageHeader>

      <RecruiterStatsGrid data={data} loading={loading} />

      {!error && (
        <Card className="border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-violet-600" />
              Hiring overview
            </CardTitle>
            <CardDescription>
              {loading
                ? "Loading pipeline…"
                : data && data.stats.openJobs > 0
                  ? `${data.stats.openJobs} open role${data.stats.openJobs === 1 ? "" : "s"} · ${data.stats.totalApplications} total application${data.stats.totalApplications === 1 ? "" : "s"}`
                  : "Post a job to start receiving applications."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href={RECRUITER_DASHBOARD_LINKS.applications}>
                Review applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && !loading && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart
              data={applicationsTrend}
              title="Applications over time"
              description="Last 6 months — applications, under review, and shortlisted"
            />
          </div>
          <PipelineChart data={pipelineChartData} />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your open jobs</h2>
          <Button variant="link" size="sm" asChild>
            <Link href={RECRUITER_DASHBOARD_LINKS.jobs}>View all</Link>
          </Button>
        </div>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : openJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-muted-foreground">
                No open jobs yet. Post your first listing to start hiring.
              </p>
              <Button asChild>
                <Link href={RECRUITER_DASHBOARD_LINKS.jobs}>Go to Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <JobsTable
            jobs={openJobs}
            onEdit={(job) => router.push(`/jobs/${job.id}`)}
            onDelete={() => router.push(RECRUITER_DASHBOARD_LINKS.jobs)}
            onClose={(job) => void handleCloseJob(job.id)}
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent applications</h2>
          <Button variant="link" size="sm" asChild>
            <Link href={RECRUITER_DASHBOARD_LINKS.applications}>
              View all
            </Link>
          </Button>
        </div>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : recentApplications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Applications appear here when candidates apply to your jobs."
            className="py-8"
          />
        ) : (
          <RecruiterApplicationsView applications={recentApplications} />
        )}
      </div>
    </div>
  );
}

export default withRole(RecruiterDashboardPage, {
  allowedRoles: ["recruiter"],
});
