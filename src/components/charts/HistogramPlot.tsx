"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartProps } from "@/types";

export function HistogramPlot({ data }: ChartProps) {
  if (!data || data.length === 0 || !data.every(item => 'range' in item && 'count' in item)) {
     return <div className="text-center p-4">Histogram: Insufficient or malformed data. Expects data with 'range' and 'count' keys.</div>;
  }
  
  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsBarChart data={data} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="range"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis dataKey="count" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
