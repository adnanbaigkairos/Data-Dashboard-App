"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartProps, PlotColumnConfig } from "@/types";

function getSelectedColumnName(columns: PlotColumnConfig[], role: string): string | undefined {
  return columns.find(c => c.role === role)?.columnName;
}

export function CountPlot({ data, config }: ChartProps) {
  const categoryKey = getSelectedColumnName(config.columns, 'category');

  if (!categoryKey || data.length === 0 || !data.every(item => categoryKey in item && 'count' in item)) {
    return <div className="text-center p-4">Count Plot: Insufficient or malformed data.</div>;
  }
  
  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsBarChart data={data} layout="vertical" margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" dataKey="count" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          type="category"
          dataKey={categoryKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={100} // Adjust based on label length
          tickFormatter={(value) => typeof value === 'string' ? (value.length > 15 ? value.slice(0,12) + '...' : value) : value}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
