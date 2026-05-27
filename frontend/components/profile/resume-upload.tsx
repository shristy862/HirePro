"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Loader2, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/use-profile";
import {
  fetchResumePath,
  getResumePublicUrl,
  uploadResumeFile,
} from "@/lib/api/resume";
import { getErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";

const MAX_SIZE_MB = 5;

export function ResumeUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { refetch: refetchProfile } = useProfile();
  const [resumePath, setResumePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadResume = useCallback(async () => {
    setLoading(true);
    try {
      const path = await fetchResumePath();
      setResumePath(path);
    } catch {
      setResumePath(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResume();
  }, [loadResume]);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const path = await uploadResumeFile(file);
      setResumePath(path);
      await refetchProfile();
      toast.success("Resume uploaded successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const publicUrl = getResumePublicUrl(resumePath);

  return (
    <div id="profile-resume" className="space-y-3 scroll-mt-24">
      <Label>Resume (PDF)</Label>
      <p className="text-sm text-muted-foreground">
        Upload your resume so recruiters can review it. Max {MAX_SIZE_MB}MB, PDF
        only.
      </p>

      {loading ? (
        <div className="h-20 animate-pulse rounded-lg bg-muted" />
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              {publicUrl ? (
                <>
                  <p className="font-medium">Resume on file</p>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex cursor-pointer items-center gap-1 text-sm text-violet-600 hover:underline dark:text-violet-400"
                  >
                    View resume
                    <ExternalLink className="size-3.5" />
                  </a>
                </>
              ) : (
                <>
                  <p className="font-medium">No resume uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    Add a PDF to complete this section
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  {publicUrl ? "Replace PDF" : "Upload PDF"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
