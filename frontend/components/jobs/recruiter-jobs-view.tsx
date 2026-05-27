"use client";

import { useState } from "react";
import { Plus, Briefcase, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchFilter } from "@/components/shared/search-filter";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { JobFormDialog } from "@/components/jobs/job-form-dialog";
import { DeleteJobDialog } from "@/components/jobs/delete-job-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobs } from "@/hooks/use-jobs";
import { useDebounce } from "@/hooks/use-debounce";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Job } from "@/types/jobs";
import type { CreateJobPayload, UpdateJobPayload } from "@/types/jobs";

export function RecruiterJobsView() {
  const {
    loading,
    error,
    stats,
    loadJobs,
    getFiltered,
    createJob,
    updateJob,
    deleteJob,
    closeJob,
  } = useJobs();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const debouncedSearch = useDebounce(search);

  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filteredJobs = getFiltered({
    search: debouncedSearch || undefined,
    status: statusFilter,
    employmentType: typeFilter,
  });

  const openCreate = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleFormSubmit = async (
    payload: CreateJobPayload | UpdateJobPayload
  ) => {
    if (editingJob) {
      await updateJob(editingJob.id, payload);
    } else {
      await createJob(payload as CreateJobPayload);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteJob(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      const { toast } = await import("sonner");
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClose = async (job: Job) => {
    try {
      await closeJob(job.id);
    } catch (err) {
      const { toast } = await import("sonner");
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Create and manage your open positions — all listings sync with your backend in real time."
      >
        <div className="flex gap-2">
          <Button variant="outline" size="default" onClick={() => loadJobs()}>
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
            onClick={openCreate}
          >
            <Plus className="mr-2 size-4" />
            Post job
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by title, location, or skills..."
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "Open", value: "open" },
              { label: "Closed", value: "closed" },
            ],
          },
          {
            label: "Type",
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { label: "Full-time", value: "full-time" },
              { label: "Part-time", value: "part-time" },
              { label: "Internship", value: "internship" },
              { label: "Contract", value: "contract" },
            ],
          },
        ]}
      />

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <EmptyState
          icon={Briefcase}
          title="Could not load jobs"
          description={error}
          action={{ label: "Try again", onClick: () => loadJobs() }}
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={jobsEmptyTitle(stats.total, debouncedSearch, statusFilter)}
          description={
            stats.total === 0
              ? "Post your first role to start receiving applications from matched candidates."
              : "Try adjusting your search or filters to find listings."
          }
          action={
            stats.total === 0
              ? { label: "Post your first job", onClick: openCreate }
              : undefined
          }
        />
      ) : (
        <JobsTable
          jobs={filteredJobs}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onClose={handleClose}
        />
      )}

      <JobFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        job={editingJob}
        onSubmit={handleFormSubmit}
      />

      <DeleteJobDialog
        job={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

function jobsEmptyTitle(
  total: number,
  search: string,
  status: string
): string {
  if (total === 0) return "No jobs posted yet";
  if (search || status !== "all") return "No jobs match your filters";
  return "No jobs found";
}
