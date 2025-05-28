"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartProps } from "@/types";


export function DensityPlot({ data }: ChartProps) {
  if (!data || data.length === 0 || !data.every(item => 'x' in item && 'density' in item)) {
    return <div className="text-center p-4">Density Plot: Insufficient or malformed data. Expects data with 'x' and 'density' keys.</div>;
  }

  const chartConfig = {
    density: {
      label: "Density",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <RechartsAreaChart data={data} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis dataKey="density" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="density"
          type="monotone"
          fill="var(--color-density)"
          fillOpacity={0.4}
          stroke="var(--color-density)"
          strokeWidth={2}
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}
