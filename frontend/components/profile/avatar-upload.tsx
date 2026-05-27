"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/auth-context";
import { fetchAvatarPath, uploadAvatarFile } from "@/lib/api/avatar";
import { getUploadPublicUrl } from "@/lib/utils/uploads";
import { getErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface AvatarUploadProps {
  name: string;
  onUploaded?: (avatarPath: string) => void;
}

export function AvatarUpload({ name, onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useAuthContext();
  const [avatarPath, setAvatarPath] = useState<string | null>(
    user?.avatar?.trim() || null
  );
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const loadAvatar = useCallback(async () => {
    setLoading(true);
    try {
      const path = await fetchAvatarPath();
      setAvatarPath(path);
      if (path) {
        updateUser({ avatar: path });
      }
    } catch {
      setAvatarPath(user?.avatar?.trim() || null);
    } finally {
      setLoading(false);
    }
  }, [updateUser, user?.avatar]);

  useEffect(() => {
    void loadAvatar();
  }, [loadAvatar]);

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Use a JPEG, PNG, WebP, or GIF image");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const path = await uploadAvatarFile(file);
      setAvatarPath(path);
      updateUser({ avatar: path });
      onUploaded?.(path);
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const previewUrl = getUploadPublicUrl(avatarPath);

  return (
    <div className="space-y-3">
      <Label>Profile picture</Label>
      <p className="text-sm text-muted-foreground">
        JPG, PNG, WebP, or GIF. Max {MAX_SIZE_MB}MB.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {loading ? (
          <div className="size-20 animate-pulse rounded-full bg-muted" />
        ) : (
          <Avatar className="size-20 ring-2 ring-violet-500/20">
            <AvatarImage src={previewUrl ?? undefined} alt={name} />
            <AvatarFallback className="bg-violet-600 text-xl text-white">
              {initials || <User className="size-8" />}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer w-fit"
            disabled={uploading || loading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="mr-2 size-4" />
                {previewUrl ? "Change photo" : "Upload photo"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
