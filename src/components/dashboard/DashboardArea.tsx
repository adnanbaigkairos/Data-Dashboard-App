
"use client";

import { useDashboard } from '@/contexts/DashboardContext';
import { PlotCard } from './PlotCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3 } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout, Layouts } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);
const DASHBOARD_CAPTURE_ID = "dashboard-content-to-capture";

export function DashboardArea() {
  const { plots, csvData, updateAllPlotLayouts } = useDashboard();

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

  const generatedLayouts: Layouts = {
    lg: plots.map(plot => ({
      i: plot.id,
      x: plot.x,
      y: plot.y,
      w: plot.w,
      h: plot.h,
      minW: plot.minW,
      minH: plot.minH,
      static: plot.static,
    }))
  };

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: Layouts) => {
    // currentLayout is for the current breakpoint
    updateAllPlotLayouts(currentLayout);
  };

  return (
    <ScrollArea className="h-full w-full bg-background"> {/* Ensure ScrollArea has a background for capture */}
      <div id={DASHBOARD_CAPTURE_ID} className="p-2 md:p-4 bg-background"> {/* Added ID and background */}
        <ResponsiveGridLayout
          layouts={generatedLayouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30} 
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          isDraggable={true}
          isResizable={true}
          containerPadding={[0, 0]} 
          margin={[10, 10]} 
        >
          {plots.map(plot => (
            <div key={plot.id} className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col group/plotcard">
              <PlotCard plot={plot} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </ScrollArea>
  );
}
