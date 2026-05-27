"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataPoint } from "@/types";

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
}

export function AnalyticsChart({
  data,
  title = "Hiring Pipeline",
  description = "Applications, interviews, and hires over time",
}: AnalyticsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.2 280)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.2 280)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.15 200)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.15 200)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: 12,
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="oklch(0.55 0.2 280)"
                fill="url(#colorApps)"
                strokeWidth={2}
                name="Applications"
              />
              <Area
                type="monotone"
                dataKey="interviews"
                stroke="oklch(0.6 0.15 200)"
                fill="url(#colorInt)"
                strokeWidth={2}
                name="Interviews"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
