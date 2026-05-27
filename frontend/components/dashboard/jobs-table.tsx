"use client";

import Link from "next/link";
import { MoreHorizontal, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatEmploymentType,
  formatJobDate,
  formatSalary,
} from "@/lib/utils/format-job";
import type { Job } from "@/types/jobs";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  open: "default",
  closed: "secondary",
};

interface JobsTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onClose: (job: Job) => void;
}

export function JobsTable({ jobs, onEdit, onDelete, onClose }: JobsTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden sm:table-cell">Salary</TableHead>
            <TableHead className="hidden lg:table-cell">Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Posted</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id} className="group">
              <TableCell>
                <Link
                  href={`/jobs/${job.id}`}
                  className="cursor-pointer font-medium transition-colors hover:text-primary"
                >
                  {job.title}
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {job.companyName}
                  {job.companyName ? " · " : ""}
                  {job.experience} · {job.skills.slice(0, 3).join(", ")}
                  {job.skills.length > 3 ? "…" : ""}
                </p>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {job.location}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="flex items-center gap-1 text-sm font-medium">
                  {formatSalary(job.salary)}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {formatEmploymentType(job.employmentType)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[job.status] ?? "outline"}>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {formatJobDate(job.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Actions for ${job.title}`}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/jobs/${job.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(job)}>
                      Edit job
                    </DropdownMenuItem>
                    {job.status === "open" && (
                      <DropdownMenuItem onClick={() => onClose(job)}>
                        Mark as closed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(job)}
                    >
                      Delete job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
