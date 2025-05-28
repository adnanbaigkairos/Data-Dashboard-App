"use client";

import { useDashboard } from '@/contexts/DashboardContext';
import { PlotCard } from './PlotCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3 } from 'lucide-react';

export function DashboardArea() {
  const { plots, csvData } = useDashboard();

  if (!csvData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-muted/20 rounded-lg">
        <BarChart3 className="w-24 h-24 text-muted-foreground mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Data Canvas</h2>
        <p className="text-muted-foreground max-w-md">
          Upload a CSV file using the control panel to start visualizing your data. 
          Select chart types, configure columns, and add plots to build your interactive dashboard.
        </p>
      </div>
    );
  }
  
  if (plots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
         <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-muted-foreground">Dashboard is Empty</h3>
        <p className="text-muted-foreground">Add plots from the control panel to see your data visualizations here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-1 md:p-2">
      <div className="flex flex-wrap gap-4 p-2 md:p-4">
        {plots.map(plot => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>
    </ScrollArea>
  );
}
