
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CSVData, PlotConfig, ChartType, PlotColumnConfig } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { prepareChartData } from '@/lib/chartUtils';
import type { Layout } from 'react-grid-layout';

interface DashboardContextType {
  csvData: CSVData | null;
  setCsvData: (data: CSVData | null) => void;
  plots: PlotConfig[];
  addPlot: (title: string, type: ChartType, columns: PlotColumnConfig[]) => void;
  removePlot: (id: string) => void;
  updatePlotTitle: (id: string, newTitle: string) => void;
  getPlotData: (plotConfig: PlotConfig) => any[];
  updateAllPlotLayouts: (newLayout: Layout[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_PLOT_WIDTH = 4; 
const DEFAULT_PLOT_HEIGHT = 8; 
const MIN_PLOT_WIDTH = 3;
const MIN_PLOT_HEIGHT = 5;


export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [plots, setPlots] = useState<PlotConfig[]>([]);
  const { toast } = useToast();

  const addPlot = useCallback((title: string, type: ChartType, columns: PlotColumnConfig[]) => {
    if (!csvData) {
      toast({ title: "Error", description: "Please upload CSV data first.", variant: "destructive" });
      return;
    }
    const newPlot: PlotConfig = {
      id: Date.now().toString(), 
      title,
      type,
      columns,
      dataKey: `data_for_plot_${Date.now().toString()}`,
      x: (plots.length * DEFAULT_PLOT_WIDTH) % 12, 
      y: Infinity, // Let react-grid-layout place it at the bottom
      w: DEFAULT_PLOT_WIDTH,
      h: DEFAULT_PLOT_HEIGHT,
      minW: MIN_PLOT_WIDTH,
      minH: MIN_PLOT_HEIGHT,
      static: false,
    };
    setPlots(prevPlots => [...prevPlots, newPlot]);
    toast({ title: "Plot Added", description: `${title} (${type}) has been added to the dashboard.` });
  }, [csvData, plots, toast]);

  const removePlot = useCallback((id: string) => {
    setPlots(prevPlots => prevPlots.filter(plot => plot.id !== id));
    toast({ title: "Plot Removed", description: "The plot has been removed from the dashboard." });
  }, [toast]);

  const updatePlotTitle = useCallback((id: string, newTitle: string) => {
    setPlots(prevPlots =>
      prevPlots.map(plot =>
        plot.id === id ? { ...plot, title: newTitle } : plot
      )
    );
  }, []);
  
  const getPlotData = useCallback((plotConfig: PlotConfig): any[] => {
    if (!csvData) return [];
    return prepareChartData(csvData.rows, plotConfig);
  }, [csvData]);

  const updateAllPlotLayouts = useCallback((currentLayout: Layout[]) => {
    setPlots(prevPlots => {
      return prevPlots.map(plot => {
        const layoutItem = currentLayout.find(l => l.i === plot.id);
        if (layoutItem) {
          return {
            ...plot,
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
            static: layoutItem.static || false,
          };
        }
        return plot;
      }).sort((a,b) => a.y - b.y || a.x - b.x); // Keep plots sorted by position for consistent rendering order
    });
  }, []);

  return (
    <DashboardContext.Provider value={{ 
        csvData, 
        setCsvData, 
        plots, 
        addPlot, 
        removePlot, 
        updatePlotTitle, 
        getPlotData,
        updateAllPlotLayouts 
      }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
