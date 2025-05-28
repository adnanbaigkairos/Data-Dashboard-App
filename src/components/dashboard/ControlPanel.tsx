"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/contexts/DashboardContext';
import { parseCSV } from '@/lib/csvParser';
import type { ChartType, PlotColumnConfig, ColumnRole } from '@/types';
import { CHART_TYPES, COLUMN_REQUIREMENTS } from '@/types';
import { UploadCloud, PlusCircle, BarChartBig, LineChart, PieChart, AreaChart, Map, SigmaSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const chartIcons: Record<ChartType, React.ComponentType<{className?: string}>> = {
  line: LineChart,
  bar: BarChartBig,
  pie: PieChart,
  histogram: SigmaSquare,
  density: AreaChart,
  count: BarChartBig, // Or another specific icon
  map: Map,
};

export function ControlPanel() {
  const { csvData, setCsvData, addPlot } = useDashboard();
  const [selectedChartType, setSelectedChartType] = useState<ChartType | undefined>(undefined);
  const [columnSelections, setColumnSelections] = useState<PlotColumnConfig[]>([]);
  const [plotTitle, setPlotTitle] = useState<string>("");
  const { toast } = useToast();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const parsedData = parseCSV(text);
          if (parsedData.headers.length === 0 && parsedData.rows.length === 0 && text.trim() !== "") {
             toast({ title: "CSV Parsing Error", description: "Could not parse headers. Check CSV format.", variant: "destructive" });
             setCsvData(null);
          } else if (parsedData.headers.length > 0 && parsedData.rows.length === 0 && text.split(/\r?\n/).length > 1) {
            toast({ title: "CSV Warning", description: "Headers found but no data rows. Please check your CSV.", variant: "default" });
            setCsvData(parsedData);
          } else {
            setCsvData(parsedData);
            toast({ title: "CSV Uploaded", description: `${file.name} processed successfully.` });
          }
        } catch (error) {
          console.error("Error parsing CSV:", error);
          toast({ title: "CSV Parsing Error", description: "Failed to parse CSV file. Please check console for details.", variant: "destructive" });
          setCsvData(null);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    // Reset column selections when chart type changes
    if (selectedChartType) {
      setColumnSelections(
        COLUMN_REQUIREMENTS[selectedChartType].map(req => ({ role: req.role, columnName: '' }))
      );
      setPlotTitle(CHART_TYPES.find(ct => ct.value === selectedChartType)?.label || "New Plot");
    } else {
      setColumnSelections([]);
      setPlotTitle("");
    }
  }, [selectedChartType]);

  const handleColumnChange = (role: ColumnRole, columnName: string) => {
    setColumnSelections(prev =>
      prev.map(sel => (sel.role === role ? { ...sel, columnName } : sel))
    );
  };

  const handleAddPlot = () => {
    if (!selectedChartType) {
      toast({ title: "Error", description: "Please select a chart type.", variant: "destructive" });
      return;
    }
    if (!plotTitle.trim()) {
      toast({ title: "Error", description: "Please enter a plot title.", variant: "destructive" });
      return;
    }
    const allColumnsSelected = COLUMN_REQUIREMENTS[selectedChartType].every(req =>
      columnSelections.find(sel => sel.role === req.role && sel.columnName)
    );
    if (!allColumnsSelected) {
      toast({ title: "Error", description: "Please select all required columns for the chosen chart type.", variant: "destructive" });
      return;
    }
    addPlot(plotTitle, selectedChartType, columnSelections);
    // Optionally reset fields after adding
    // setSelectedChartType(undefined); 
    // setPlotTitle("");
  };

  const currentColumnRequirements = selectedChartType ? COLUMN_REQUIREMENTS[selectedChartType] : [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Control Panel</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="csv-upload" className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5" /> Data Source (CSV)
            </Label>
            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="file:text-primary file:font-semibold" />
          </div>

          {csvData && csvData.headers.length > 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="chart-type" className="flex items-center gap-2">
                  <BarChartBig className="w-5 h-5" /> Chart Type
                </Label>
                <Select onValueChange={(value: ChartType) => setSelectedChartType(value)} value={selectedChartType}>
                  <SelectTrigger id="chart-type">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHART_TYPES.map(type => {
                       const Icon = type.icon || chartIcons[type.value as ChartType];
                       return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="w-4 h-4" />}
                            {type.label}
                          </div>
                        </SelectItem>
                       );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedChartType && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="plot-title">Plot Title</Label>
                    <Input 
                      id="plot-title" 
                      value={plotTitle} 
                      onChange={(e) => setPlotTitle(e.target.value)} 
                      placeholder="Enter plot title" 
                    />
                  </div>
                  {currentColumnRequirements.map(req => (
                    <div key={req.role} className="space-y-2">
                      <Label htmlFor={`column-${req.role}`}>{req.label} ({req.type})</Label>
                      <Select
                        onValueChange={(value: string) => handleColumnChange(req.role, value)}
                        value={columnSelections.find(sel => sel.role === req.role)?.columnName || ''}
                      >
                        <SelectTrigger id={`column-${req.role}`}>
                          <SelectValue placeholder={`Select ${req.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {csvData.headers.map(header => (
                            <SelectItem key={header} value={header}>{header}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </CardContent>
      </ScrollArea>
      {csvData && selectedChartType && (
        <div className="p-4 border-t">
          <Button onClick={handleAddPlot} className="w-full">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Plot to Dashboard
          </Button>
        </div>
      )}
    </Card>
  );
}
