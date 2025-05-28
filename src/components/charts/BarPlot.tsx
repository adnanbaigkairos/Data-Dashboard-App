"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartProps, PlotColumnConfig } from "@/types";

function getSelectedColumnName(columns: PlotColumnConfig[], role: string): string | undefined {
  return columns.find(c => c.role === role)?.columnName;
}

export function BarPlot({ data, config }: ChartProps) {
  const categoryKey = getSelectedColumnName(config.columns, 'category');
  const valueKey = getSelectedColumnName(config.columns, 'value');

  if (!categoryKey || !valueKey || data.length === 0) {
    return <div className="text-center p-4">Bar Plot: Insufficient data or configuration.</div>;
  }

  const valueLabel = valueKey || "Value";

  const chartConfig = {
    [valueLabel]: {
      label: valueLabel,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsBarChart data={data} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={categoryKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 10) : value}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={valueLabel} fill={`var(--color-${valueLabel})`} radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
