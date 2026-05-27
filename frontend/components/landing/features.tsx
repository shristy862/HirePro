import {
  Brain,
  BarChart3,
  Shield,
  Zap,
  Users,
  FileSearch,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Candidate Matching",
    description:
      "Semantic resume analysis scores fit against job requirements in seconds, not hours.",
  },
  {
    icon: Zap,
    title: "Automated Screening",
    description:
      "Filter thousands of applications with intelligent pipelines that learn from your hires.",
  },
  {
    icon: BarChart3,
    title: "Hiring Analytics",
    description:
      "Real-time dashboards track pipeline health, time-to-hire, and diversity metrics.",
  },
  {
    icon: FileSearch,
    title: "Smart Job Parsing",
    description:
      "Post jobs in plain language — AI structures requirements and suggests salary bands.",
  },
  {
    icon: Users,
    title: "Collaborative Hiring",
    description:
      "Scorecards, shared notes, and interview kits keep your entire team aligned.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Role-based access, audit logs, and GDPR-compliant data handling built in.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to scale hiring
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From sourcing to offer letter — one platform that thinks as fast as you do.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white dark:text-violet-400">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
