"use client";

import { useAuthContext } from "@/context/auth-context";
import { useProfile } from "@/hooks/use-profile";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileForm } from "@/components/forms/profile-form";
import { CandidateProfileForm } from "@/components/profile/candidate-profile-form";
import { ProfileCompletionProgress } from "@/components/profile/profile-completion-progress";
import { ProfileFieldChecklist } from "@/components/profile/profile-field-checklist";
import { ProfileApiStatus } from "@/components/profile/profile-api-status";
import { ResumeUpload } from "@/components/profile/resume-upload";
import { ResumeAnalyzer } from "@/components/profile/resume-analyzer";
import { formatUserRole } from "@/lib/utils/format-role";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthContext();
  const isCandidate = user?.role === "candidate";
  const {
    completion,
    loading: profileLoading,
    error: profileError,
    refetch,
    isReady,
  } = useProfile();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Profile Settings"
        description={
          isCandidate
            ? "Build your job seeker profile — completion updates when you save"
            : "Manage your account and notification preferences"
        }
      />

      {isCandidate && (
        <ProfileApiStatus
          loading={profileLoading}
          error={profileError}
          onRetry={() => void refetch()}
        >
          {completion && (
            <>
              <ProfileCompletionProgress
                completion={completion}
                variant="inline"
              />
              {!completion.isComplete && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      What&apos;s missing?
                    </CardTitle>
                    <CardDescription>
                      Tap a section to jump there and fill it in
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileFieldChecklist fields={completion.fields} />
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </ProfileApiStatus>
      )}

      {isCandidate && <ResumeAnalyzer />}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            {isCandidate
              ? "Details visible to recruiters when you apply"
              : "Update your personal information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload name={user.name} />
          <div className="space-y-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="border-violet-500/30 capitalize">
              {formatUserRole(user.role)}
            </Badge>
          </div>
          <Separator />
          {isCandidate ? (
            <>
              <ResumeUpload />
              <Separator />
              <CandidateProfileForm
                disabled={profileLoading || !!profileError || !isReady}
              />
            </>
          ) : (
            <ProfileForm
              defaultValues={{
                name: user.name,
                email: user.email,
                title: user.title ?? "",
                company: user.company ?? "",
                bio: "",
              }}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what updates you receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              id: "email-apps",
              label:
                user.role === "recruiter"
                  ? "New applications"
                  : "Application updates",
              default: true,
            },
            { id: "email-ai", label: "AI insights digest", default: true },
            { id: "email-marketing", label: "Product updates", default: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <Label htmlFor={item.id}>{item.label}</Label>
              <Switch
                id={item.id}
                defaultChecked={item.default}
                onCheckedChange={() => toast.success("Preference saved")}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
