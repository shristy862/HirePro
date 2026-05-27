import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  dashboardHref: string;
  dashboardLabel: string;
}

export function AccessDenied({
  title = "Access restricted",
  description = "You don't have permission to view this page. We'll take you to your dashboard.",
  dashboardHref,
  dashboardLabel,
}: AccessDeniedProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md w-full border-violet-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="size-7" aria-hidden />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
            <Link href={dashboardHref}>
              Go to {dashboardLabel}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
