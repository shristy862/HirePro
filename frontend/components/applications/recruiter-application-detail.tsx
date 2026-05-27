"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Loader2,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { APPLICATION_STATUS_UPDATE_OPTIONS } from "@/constants/applications";
import { getResumePublicUrl } from "@/lib/api/resume";
import { getErrorMessage } from "@/lib/utils/errors";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/types/applications";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  reviewed:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  shortlisted:
    "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

interface RecruiterApplicationDetailProps {
  application: Application;
  backHref?: string;
  onStatusChange: (
    applicationId: string,
    status: ApplicationStatus
  ) => Promise<Application>;
  onApplicationUpdated?: (application: Application) => void;
}

export function RecruiterApplicationDetail({
  application,
  backHref = "/applications",
  onStatusChange,
  onApplicationUpdated,
}: RecruiterApplicationDetailProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(application.status);
  }, [application]);

  const resumeUrl = getResumePublicUrl(application.resumeUrl);
  const hasStatusChange = status !== application.status;

  const handleSaveStatus = async () => {
    if (!hasStatusChange) return;

    setSaving(true);
    try {
      const updated = await onStatusChange(application.id, status);
      onApplicationUpdated?.(updated);
      toast.success("Application status updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
      setStatus(application.status);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={backHref}>
          <ArrowLeft className="mr-2 size-4" />
          Back to applications
        </Link>
      </Button>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {application.candidateName}
        </h1>
        <p className="text-muted-foreground">
          Application for {application.jobTitle}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge
            variant="outline"
            className={cn("capitalize", statusStyles[application.status])}
          >
            {APPLICATION_STATUS_LABELS[application.status]}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Applied {new Date(application.appliedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Candidate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <User className="size-4 shrink-0 text-muted-foreground" />
            {application.candidateName}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <a
              href={`mailto:${application.candidateEmail}`}
              className="cursor-pointer text-primary hover:underline"
            >
              {application.candidateEmail}
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium">{application.jobTitle}</p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="size-4 shrink-0" />
            {application.company}
          </p>
          {application.location && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {application.location}
            </p>
          )}
          <Separator className="my-3" />
          <Button variant="link" size="sm" className="h-auto p-0" asChild>
            <Link href={`/jobs/${application.jobId}`}>View job listing</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cover letter</CardTitle>
        </CardHeader>
        <CardContent>
          {application.coverLetter?.trim() ? (
            <p className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {application.coverLetter}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No cover letter provided.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resume</CardTitle>
        </CardHeader>
        <CardContent>
          {resumeUrl ? (
            <Button asChild variant="outline">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Download className="mr-2 size-4" />
                Download resume
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              No resume attached to this application.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="application-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as ApplicationStatus)
              }
              disabled={saving}
            >
              <SelectTrigger id="application-status" className="w-full sm:max-w-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_STATUS_UPDATE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => void handleSaveStatus()}
            disabled={!hasStatusChange || saving}
            className="bg-gradient-to-r from-violet-600 to-indigo-600"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save status"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
