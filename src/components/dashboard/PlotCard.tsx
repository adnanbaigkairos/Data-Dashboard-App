"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit3, Save, XCircle } from "lucide-react";
import type { PlotConfig, ChartType } from "@/types";
import { useDashboard } from "@/contexts/DashboardContext";

import { LinePlot } from "@/components/charts/LinePlot";
import { BarPlot } from "@/components/charts/BarPlot";
import { PiePlot } from "@/components/charts/PiePlot";
import { HistogramPlot } from "@/components/charts/HistogramPlot";
import { DensityPlot } from "@/components/charts/DensityPlot";
import { CountPlot } from "@/components/charts/CountPlot";
import { PlaceholderPlot } from "@/components/charts/PlaceholderPlot";

interface PlotCardProps {
  plot: PlotConfig;
}

const chartComponents: Record<ChartType, React.ComponentType<any>> = {
  line: LinePlot,
  bar: BarPlot,
  pie: PiePlot,
  histogram: HistogramPlot,
  density: DensityPlot,
  count: CountPlot,
  map: PlaceholderPlot, // Map plot placeholder
};

export function PlotCard({ plot }: PlotCardProps) {
  const { removePlot, updatePlotTitle, getPlotData } = useDashboard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState(plot.title);

  const ChartComponent = chartComponents[plot.type] || PlaceholderPlot;
  const chartData = getPlotData(plot);
  
  const handleSaveTitle = () => {
    if (editableTitle.trim()) {
      updatePlotTitle(plot.id, editableTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditableTitle(plot.title);
    setIsEditingTitle(false);
  }

  return (
    <Card className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] xl:w-[calc(25%-0.75rem)] flex flex-col shadow-lg break-inside-avoid-column">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {isEditingTitle ? (
          <div className="flex items-center gap-2 w-full">
            <Input 
              value={editableTitle} 
              onChange={(e) => setEditableTitle(e.target.value)} 
              className="h-8 text-lg font-semibold"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
            />
            <Button variant="ghost" size="icon" onClick={handleSaveTitle} aria-label="Save title">
              <Save className="h-4 w-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancelEditTitle} aria-label="Cancel edit title">
              <XCircle className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <>
            <CardTitle className="text-lg font-semibold truncate" title={plot.title}>
              {plot.title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(true)} aria-label="Edit title">
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removePlot(plot.id)} aria-label="Remove plot">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-2 min-h-[250px] flex items-center justify-center">
        {ChartComponent === PlaceholderPlot ? (
          <PlaceholderPlot title={plot.title} message={plot.type === 'map' ? 'Map Plot functionality is a placeholder.' : 'Chart component not found.'} />
        ) : (
          <ChartComponent data={chartData} config={plot} />
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2 pb-2 px-4">
        <CardDescription>Type: {plot.type}</CardDescription>
      </CardFooter>
    </Card>
  );
}
