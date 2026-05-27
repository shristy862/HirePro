"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  User,
  Building2,
  Briefcase,
  Pencil,
  Trash2,
  Ban,
} from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { JobFormDialog } from "@/components/jobs/job-form-dialog";
import { DeleteJobDialog } from "@/components/jobs/delete-job-dialog";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { JobApplyButton } from "@/components/jobs/job-apply-button";
import { JobApplicantsSection } from "@/components/applications/job-applicants-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  fetchJobById,
  updateJob,
  deleteJob,
  closeJob,
} from "@/lib/api/jobs";
import {
  formatEmploymentType,
  formatJobDate,
  formatSalary,
} from "@/lib/utils/format-job";
import { getErrorMessage } from "@/lib/utils/errors";
import type { Job, UpdateJobPayload } from "@/types/jobs";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, hasRole } = useAuthContext();
  const isRecruiter = hasRole("recruiter");

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const isOwner =
    isRecruiter &&
    !!user?.id &&
    !!job?.createdBy?.id &&
    String(job.createdBy.id) === String(user.id);

  const loadJob = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchJobById(id);
      setJob(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handleUpdate = async (payload: UpdateJobPayload) => {
    if (!job) return;
    try {
      const updated = await updateJob(job.id, payload);
      setJob(updated);
      toast.success("Job updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    setActionLoading(true);
    try {
      await deleteJob(job.id);
      toast.success("Job deleted");
      router.push("/jobs");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
      setDeleteOpen(false);
    }
  };

  const handleClose = async () => {
    if (!job) return;
    try {
      const updated = await closeJob(job.id);
      setJob(updated);
      toast.success("Job closed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!job) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Job not found"
        description="This listing may have been removed or the link is incorrect."
        action={{ label: "Back to jobs", href: "/jobs" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 size-4" />
            Back to jobs
          </Link>
        </Button>
        <Badge variant={job.status === "open" ? "default" : "secondary"}>
          {job.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {job.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
            {job.companyName && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Building2 className="size-4" />
                {job.companyName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" />
              {formatEmploymentType(job.employmentType)}
            </span>
            {job.createdBy && (
              <span className="flex items-center gap-1">
                <User className="size-4" />
                {job.createdBy.name}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Posted {formatJobDate(job.createdAt)} · {job.experience} experience
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isRecruiter && (
            <SaveJobButton jobId={job.id} size="default" />
          )}
          {isRecruiter && isOwner ? (
            <>
              <Button variant="outline" onClick={() => setFormOpen(true)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </Button>
              {job.status === "open" && (
                <Button variant="secondary" onClick={handleClose}>
                  <Ban className="mr-2 size-4" />
                  Close listing
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
            </>
          ) : (
            job && <JobApplyButton job={job} />
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="size-4" />
            Compensation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">
            {formatSalary(job.salary)}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              per year
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About the role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {job.description}
          </p>
          <Separator />
          <div>
            <h3 className="font-medium">Required skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isRecruiter && isOwner && (
        <JobApplicantsSection jobId={job.id} />
      )}

      {isRecruiter && isOwner && (
        <>
          <JobFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            job={job}
            onSubmit={handleUpdate}
          />
          <DeleteJobDialog
            job={job}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            loading={actionLoading}
          />
        </>
      )}
    </div>
  );
}
