"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileContext } from "@/context/profile-context";
import {
  candidateProfileSchema,
  parseSkillsInput,
  skillsToInput,
  type CandidateProfileFormValues,
} from "@/validators/profile";

interface CandidateProfileFormProps {
  disabled?: boolean;
}

export function CandidateProfileForm({
  disabled = false,
}: CandidateProfileFormProps) {
  const { profile, saving, updateProfile } = useProfileContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CandidateProfileFormValues>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: {
      bio: "",
      skills: "",
      experience: "",
      education: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
  });

  useEffect(() => {
    if (!profile) return;
    reset({
      bio: profile.bio ?? "",
      skills: skillsToInput(profile.skills ?? []),
      experience: profile.experience ?? "",
      education: profile.education ?? "",
      linkedin: profile.linkedin ?? "",
      github: profile.github ?? "",
      portfolio: profile.portfolio ?? "",
    });
  }, [profile, reset]);

  const onSubmit = async (values: CandidateProfileFormValues) => {
    await updateProfile({
      bio: values.bio.trim(),
      skills: parseSkillsInput(values.skills),
      experience: values.experience.trim(),
      education: values.education.trim(),
      linkedin: values.linkedin.trim(),
      github: values.github.trim(),
      portfolio: values.portfolio.trim(),
    });
  };

  if (disabled && !profile) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
        <p className="text-sm text-muted-foreground">
          Load your profile above to edit fields, or use Retry if the API failed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div id="profile-bio" className="space-y-2 scroll-mt-24">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder="Tell recruiters about yourself, goals, and strengths..."
          {...register("bio")}
          aria-invalid={!!errors.bio}
        />
        {errors.bio && (
          <p className="text-xs text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div id="profile-skills" className="space-y-2 scroll-mt-24">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Input
          id="skills"
          placeholder="React, TypeScript, Node.js"
          {...register("skills")}
          aria-invalid={!!errors.skills}
        />
        {errors.skills && (
          <p className="text-xs text-destructive">{errors.skills.message}</p>
        )}
      </div>

      <div id="profile-experience" className="space-y-2 scroll-mt-24">
        <Label htmlFor="experience">Work experience</Label>
        <Textarea
          id="experience"
          rows={3}
          placeholder="Roles, companies, and key achievements..."
          {...register("experience")}
        />
      </div>

      <div id="profile-education" className="space-y-2 scroll-mt-24">
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          rows={2}
          placeholder="Degree, institution, graduation year..."
          {...register("education")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div id="profile-linkedin" className="space-y-2 scroll-mt-24">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/you"
            {...register("linkedin")}
            aria-invalid={!!errors.linkedin}
          />
          {errors.linkedin && (
            <p className="text-xs text-destructive">{errors.linkedin.message}</p>
          )}
        </div>
        <div id="profile-github" className="space-y-2 scroll-mt-24">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            placeholder="https://github.com/you"
            {...register("github")}
            aria-invalid={!!errors.github}
          />
          {errors.github && (
            <p className="text-xs text-destructive">{errors.github.message}</p>
          )}
        </div>
        <div id="profile-portfolio" className="space-y-2 scroll-mt-24">
          <Label htmlFor="portfolio">Portfolio</Label>
          <Input
            id="portfolio"
            placeholder="https://yourportfolio.com"
            {...register("portfolio")}
            aria-invalid={!!errors.portfolio}
          />
          {errors.portfolio && (
            <p className="text-xs text-destructive">
              {errors.portfolio.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={disabled || isSubmitting || saving || !profile}
        className="bg-gradient-to-r from-violet-600 to-indigo-600"
      >
        {isSubmitting || saving ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save profile"
        )}
      </Button>
    </form>
  );
}
