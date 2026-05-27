import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px] dark:bg-violet-600/10" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-indigo-500/15 blur-[100px]" />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <Badge
          variant="outline"
          className="mb-6 border-violet-500/30 bg-violet-500/10 px-4 py-1 text-violet-700 dark:text-violet-300"
        >
          <Sparkles className="mr-1.5 size-3.5" />
          AI-Powered Recruitment Automation
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Hire smarter.{" "}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-400">
            Hire faster.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          HireFlow automates screening, matches candidates with precision, and
          gives your team actionable insights — so you focus on people, not paperwork.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            asChild
            className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
          >
            <Link href="/signup">
              Start free trial
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8">
            <Link href="/recruiter">
              <Play className="mr-2 size-4" />
              View demo dashboard
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required · 14-day free trial · SOC 2 ready
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-5xl">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-violet-500/10 ring-1 ring-foreground/5">
          <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
            <div className="size-3 rounded-full bg-rose-400" />
            <div className="size-3 rounded-full bg-amber-400" />
            <div className="size-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs text-muted-foreground">
              recruiter.hireflow.ai
            </span>
          </div>
          <div className="aspect-[16/9] bg-gradient-to-br from-muted/50 via-background to-violet-500/5 p-8">
            <div className="grid h-full gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card/80 p-4 backdrop-blur animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="mt-4 h-8 w-12 rounded bg-violet-500/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
