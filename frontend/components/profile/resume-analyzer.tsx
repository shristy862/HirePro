"use client";

import { useState } from "react";
import {
  Brain,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeResume } from "@/lib/api/ai";
import {
  buildResumeTextFromProfile,
  parseResumeAnalysis,
} from "@/lib/utils/parse-resume-analysis";
import { useProfile } from "@/hooks/use-profile";
import { getErrorMessage } from "@/lib/utils/errors";
import { toast } from "sonner";

export function ResumeAnalyzer() {
  const { profile, isReady } = useProfile();
  const [resumeText, setResumeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReturnType<
    typeof parseResumeAnalysis
  > | null>(null);

  const fillFromProfile = () => {
    if (!profile) {
      toast.error("Load your profile first");
      return;
    }
    const text = buildResumeTextFromProfile(profile);
    if (!text.trim()) {
      toast.error("Add bio, skills, or experience to your profile first");
      return;
    }
    setResumeText(text);
    toast.success("Profile details copied — you can edit before analyzing");
  };

  const handleAnalyze = async () => {
    const text = resumeText.trim();
    if (text.length < 50) {
      toast.error("Add at least 50 characters of resume content to analyze");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeResume(text);
      setResult(parseResumeAnalysis(analysis));
      toast.success("Resume analysis complete");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="border-violet-500/25 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="size-5 text-violet-600" />
          AI resume analysis
        </CardTitle>
        <CardDescription>
          Get ATS score, skill gaps, and improvement tips powered by Gemini AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="resume-text">Resume content</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={fillFromProfile}
              disabled={!isReady}
            >
              <Sparkles className="mr-2 size-3.5" />
              Use my profile
            </Button>
          </div>
          <Textarea
            id="resume-text"
            rows={8}
            placeholder="Paste resume text, or click 'Use my profile' after filling your profile..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={analyzing}
          />
          <p className="text-xs text-muted-foreground">
            Tip: Upload a PDF above, then paste or summarize its content here for
            best results.
          </p>
        </div>

        <Button
          type="button"
          className="w-full cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 sm:w-auto"
          onClick={() => void handleAnalyze()}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Analyzing with AI…
            </>
          ) : (
            <>
              <Brain className="mr-2 size-4" />
              Analyze resume
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4 border-t pt-4">
            {result.atsScore !== null && (
              <div className="flex items-center gap-4 rounded-xl border bg-background/80 p-4">
                <div
                  className="relative flex size-20 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(violet-600 ${result.atsScore * 3.6}deg, var(--muted) 0deg)`,
                  }}
                >
                  <div className="flex size-14 flex-col items-center justify-center rounded-full bg-background text-center">
                    <span className="text-xl font-bold tabular-nums">
                      {result.atsScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ATS
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">ATS compatibility score</p>
                  <p className="text-sm text-muted-foreground">
                    {result.atsScore >= 80
                      ? "Strong match for applicant tracking systems"
                      : result.atsScore >= 60
                        ? "Good base — follow suggestions below"
                        : "Room to improve keywords and structure"}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingUp className="mr-1 size-3" />
                    out of 100
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {result.sections.map((section) => (
                <Card key={section.title} className="bg-background/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      {section.title.toLowerCase().includes("missing") ? (
                        <AlertCircle className="size-4 text-amber-600" />
                      ) : (
                        <Lightbulb className="size-4 text-violet-600" />
                      )}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
