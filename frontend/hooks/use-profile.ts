"use client";

import { useProfileContext } from "@/context/profile-context";

/** Candidate profile + completion from GET/PUT /profile APIs */
export function useProfile() {
  return useProfileContext();
}
