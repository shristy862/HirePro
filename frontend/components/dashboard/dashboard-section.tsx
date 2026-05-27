import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  viewAllHref: string;
  viewAllLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  description,
  icon: Icon,
  viewAllHref,
  viewAllLabel = "View all",
  children,
  className,
}: DashboardSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="size-5 text-violet-600" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="link" size="sm" className="shrink-0" asChild>
          <Link href={viewAllHref}>{viewAllLabel}</Link>
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
