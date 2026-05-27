"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthContext } from "@/context/auth-context";
import { fetchMyProfile, updateMyProfile } from "@/lib/api/profile";
import { isApiError } from "@/lib/api/api-error";
import { getErrorMessage } from "@/lib/utils/errors";
import type {
  CandidateProfile,
  ProfileCompletion,
  UpdateProfilePayload,
} from "@/types/profile";
import { toast } from "sonner";

interface ProfileContextValue {
  profile: CandidateProfile | null;
  completion: ProfileCompletion | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isReady: boolean;
  refetch: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, hasRole, isLoading: authLoading } = useAuthContext();
  const isCandidate = hasRole("candidate");

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletion | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (authLoading) return;

    if (!isCandidate || !user) {
      setProfile(null);
      setCompletion(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchMyProfile();
      setProfile(data.profile);
      setCompletion(data.completion);
    } catch (err) {
      const message = getErrorMessage(err);
      const status = isApiError(err) ? err.status : undefined;
      const displayMessage =
        status === 404
          ? "Profile API not found (404). Restart the backend server."
          : message;

      setProfile(null);
      setCompletion(null);
      setError(displayMessage);
    } finally {
      setLoading(false);
    }
  }, [authLoading, isCandidate, user]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const { updateUser } = useAuthContext();

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (error) {
        throw new Error(error);
      }

      setSaving(true);
      try {
        const data = await updateMyProfile(payload);
        setProfile(data.profile);
        setCompletion(data.completion);
        setError(null);
        if (data.profile.avatar) {
          updateUser({ avatar: data.profile.avatar });
        }
        toast.success("Profile updated");
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [error, updateUser]
  );

  const isReady = isCandidate && !loading && !error && !!profile && !!completion;

  const value = useMemo(
    () => ({
      profile,
      completion,
      loading: authLoading || (isCandidate && loading),
      saving,
      error: isCandidate ? error : null,
      isReady,
      refetch: loadProfile,
      updateProfile,
    }),
    [
      profile,
      completion,
      authLoading,
      isCandidate,
      loading,
      saving,
      error,
      isReady,
      loadProfile,
      updateProfile,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  return ctx;
}

export function useOptionalProfileContext() {
  return useContext(ProfileContext);
}
