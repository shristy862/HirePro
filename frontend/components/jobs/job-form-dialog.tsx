"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  jobFormSchema,
  parseSkillsInput,
  skillsToInputValue,
  type JobFormValues,
} from "@/validators/job";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/errors";
import type { CreateJobPayload, Job, UpdateJobPayload } from "@/types/jobs";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
  onSubmit: (
    payload: CreateJobPayload | UpdateJobPayload
  ) => Promise<void>;
}

const defaultValues: JobFormValues = {
  title: "",
  companyName: "",
  description: "",
  skills: "",
  salary: "",
  experience: "",
  location: "",
  employmentType: "full-time",
  status: "open",
};

export function JobFormDialog({
  open,
  onOpenChange,
  job,
  onSubmit,
}: JobFormDialogProps) {
  const isEdit = !!job;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues,
  });

  const employmentType = watch("employmentType");

  useEffect(() => {
    if (open && job) {
      reset({
        title: job.title,
        companyName: job.companyName,
        description: job.description,
        skills: skillsToInputValue(job.skills),
        salary: String(job.salary),
        experience: job.experience,
        location: job.location,
        employmentType: job.employmentType,
        status: job.status,
      });
    } else if (open) {
      reset(defaultValues);
    }
  }, [open, job, reset]);

  const handleFormSubmit = async (values: JobFormValues) => {
    const payload = {
      title: values.title,
      companyName: values.companyName,
      description: values.description,
      skills: parseSkillsInput(values.skills),
      salary: Number(values.salary),
      experience: values.experience,
      location: values.location,
      employmentType: values.employmentType,
      ...(isEdit && values.status ? { status: values.status } : {}),
    };

    try {
      await onSubmit(payload);
      onOpenChange(false);
      reset(defaultValues);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit job" : "Post a new job"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update listing details. Changes are visible to candidates immediately."
              : "Fill in the role details. Required fields are marked."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job title *</Label>
            <Input
              id="job-title"
              placeholder="Senior Full Stack Engineer"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-company">Company name *</Label>
            <Input
              id="job-company"
              placeholder="Acme Inc."
              {...register("companyName")}
              aria-invalid={!!errors.companyName}
            />
            {errors.companyName && (
              <p className="text-xs text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Description *</Label>
            <Textarea
              id="job-description"
              rows={4}
              placeholder="Describe the role, team, and impact..."
              {...register("description")}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-location">Location *</Label>
              <Input
                id="job-location"
                placeholder="San Francisco, CA or Remote"
                {...register("location")}
                aria-invalid={!!errors.location}
              />
              {errors.location && (
                <p className="text-xs text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-experience">Experience *</Label>
              <Input
                id="job-experience"
                placeholder="3–5 years"
                {...register("experience")}
                aria-invalid={!!errors.experience}
              />
              {errors.experience && (
                <p className="text-xs text-destructive">
                  {errors.experience.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job-salary">Annual salary (INR) *</Label>
              <Input
                id="job-salary"
                type="number"
                min={1}
                placeholder="120000"
                {...register("salary")}
                aria-invalid={!!errors.salary}
              />
              {errors.salary && (
                <p className="text-xs text-destructive">
                  {errors.salary.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Employment type *</Label>
              <Select
                value={employmentType}
                onValueChange={(v) =>
                  setValue("employmentType", v as JobFormValues["employmentType"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-skills">Skills (comma-separated) *</Label>
            <Input
              id="job-skills"
              placeholder="React, TypeScript, Node.js"
              {...register("skills")}
              aria-invalid={!!errors.skills}
            />
            {errors.skills && (
              <p className="text-xs text-destructive">{errors.skills.message}</p>
            )}
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch("status") ?? "open"}
                onValueChange={(v) =>
                  setValue("status", v as "open" | "closed")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Publish job"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
