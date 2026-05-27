"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyToJob } from "@/lib/api/applications";
import { fetchResumePath } from "@/lib/api/resume";
import { getErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";
import type { Job } from "@/types/jobs";

interface ApplyJobDialogProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ApplyJobDialog({
  job,
  open,
  onOpenChange,
  onSuccess,
}: ApplyJobDialogProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coverLetter.trim().length < 10) {
      toast.error("Cover letter must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      let resume: string | undefined;
      try {
        resume = (await fetchResumePath()) ?? undefined;
      } catch {
        resume = undefined;
      }

      await applyToJob(job.id, {
        coverLetter: coverLetter.trim(),
        resume,
      });

      toast.success("Application submitted successfully");
      setCoverLetter("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for {job.title}</DialogTitle>
          <DialogDescription>
            {job.companyName && `${job.companyName} · `}
            {job.location} — add a short cover letter for the hiring team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover-letter">Cover letter *</Label>
            <Textarea
              id="cover-letter"
              rows={5}
              placeholder="Why you're a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters. Your uploaded resume (if any) will be
              attached automatically.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
