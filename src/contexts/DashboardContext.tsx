"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CSVData, PlotConfig, ChartType, PlotColumnConfig } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { prepareChartData } from '@/lib/chartUtils';

interface DashboardContextType {
  csvData: CSVData | null;
  setCsvData: (data: CSVData | null) => void;
  plots: PlotConfig[];
  addPlot: (title: string, type: ChartType, columns: PlotColumnConfig[]) => void;
  removePlot: (id: string) => void;
  updatePlotTitle: (id: string, newTitle: string) => void;
  getPlotData: (plotConfig: PlotConfig) => any[];
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

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
      id: Date.now().toString(), // Simple unique ID
      title,
      type,
      columns,
      dataKey: `data_for_plot_${Date.now().toString()}`, // Placeholder, real data processed on demand
    };
    setPlots(prevPlots => [...prevPlots, newPlot]);
    toast({ title: "Plot Added", description: `${title} (${type}) has been added to the dashboard.` });
  }, [csvData, toast]);

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

  return (
    <DashboardContext.Provider value={{ csvData, setCsvData, plots, addPlot, removePlot, updatePlotTitle, getPlotData }}>
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
