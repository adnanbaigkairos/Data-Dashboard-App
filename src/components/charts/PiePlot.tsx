"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import type { ChartProps } from "@/types";

// Predefined colors for pie chart slices
const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))", // fallback primary
  "hsl(var(--accent))",  // fallback accent
];

export function PiePlot({ data, config: plotConfig }: ChartProps) {
  if (!data || data.length === 0 || !data.every(item => 'name' in item && 'value' in item)) {
    return <div className="text-center p-4">Pie Plot: Insufficient or malformed data. Expects data with 'name' and 'value' keys.</div>;
  }
  
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: PIE_COLORS[index % PIE_COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-square">
      <RechartsPieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </RechartsPieChart>
    </ChartContainer>
  );
}
