import Link from "next/link";
import { MapPin, Clock, User, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  formatEmploymentType,
  formatJobDate,
  formatSalary,
} from "@/lib/utils/format-job";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { JobApplyButton } from "@/components/jobs/job-apply-button";
import type { Job } from "@/types/jobs";

interface JobCardProps {
  job: Job;
  variant?: "candidate" | "recruiter";
}

export function JobCard({ job, variant = "candidate" }: JobCardProps) {
  return (
    <Card className="flex flex-col transition-all hover:border-violet-500/30 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg leading-snug">
              <Link
                href={`/jobs/${job.id}`}
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {job.title}
              </Link>
            </CardTitle>
            {job.companyName && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="size-3.5 shrink-0" />
                {job.companyName}
              </p>
            )}
            {job.createdBy && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <User className="size-3.5 shrink-0" />
                {job.createdBy.name}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-start gap-0.5">
            {variant === "candidate" && (
              <SaveJobButton jobId={job.id} size="sm" />
            )}
            <Badge
              variant={job.status === "open" ? "default" : "secondary"}
              className="capitalize"
            >
              {job.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatEmploymentType(job.employmentType)}
          </span>
        </div>
        <p className="text-sm font-medium">{formatSalary(job.salary)} / year</p>
        <p className="text-xs text-muted-foreground">
          {job.experience} · Posted {formatJobDate(job.createdAt)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/jobs/${job.id}`}>View details</Link>
        </Button>
        <JobApplyButton job={job} fullWidth size="sm" />
      </CardFooter>
    </Card>
  );
}
