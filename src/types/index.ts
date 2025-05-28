export type ChartType = "line" | "bar" | "pie" | "histogram" | "density" | "count" | "map";

export type ColumnRole = "xAxis" | "yAxis" | "category" | "value" | "group" | "latitude" | "longitude";

export interface PlotColumnConfig {
  role: ColumnRole;
  columnName: string;
}
export interface PlotConfig {
  id: string;
  title: string;
  type: ChartType;
  dataKey: string; 
  columns: PlotColumnConfig[];
  x: number; // Grid layout x position
  y: number; // Grid layout y position
  w: number; // Grid layout width
  h: number; // Grid layout height
  minW?: number; // Minimum width for resizing
  minH?: number; // Minimum height for resizing
  static?: boolean; // If true, item is not draggable or resizable
}

export interface CSVData {
  headers: string[];
  rows: Record<string, string | number>[]; // Values can be string or number after parsing
}

// For chart components
export type ChartProps = {
  data: any[];
  config: PlotConfig;
};

export const CHART_TYPES: { value: ChartType; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
  { value: "line", label: "Line Plot" },
  { value: "bar", label: "Bar Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "histogram", label: "Histogram" },
  { value: "density", label: "Density Plot" }, // Approximated by Area chart
  { value: "count", label: "Count Plot" },
  { value: "map", label: "Map Plot (Placeholder)" },
];

export const COLUMN_REQUIREMENTS: Record<ChartType, { role: ColumnRole, label: string, type: 'categorical' | 'numerical' }[]> = {
  line: [
    { role: "xAxis", label: "X-Axis", type: 'categorical' }, // Can be numerical too, simplified for now
    { role: "yAxis", label: "Y-Axis", type: 'numerical' },
  ],
  bar: [
    { role: "category", label: "Category", type: 'categorical' },
    { role: "value", label: "Value", type: 'numerical' },
  ],
  pie: [
    { role: "category", label: "Category", type: 'categorical' },
    { role: "value", label: "Value", type: 'numerical' },
  ],
  histogram: [
    { role: "value", label: "Value", type: 'numerical' },
  ],
  density: [ // Area plot
    { role: "xAxis", label: "X-Axis (Value)", type: 'numerical' },
    { role: "yAxis", label: "Y-Axis (Density)", type: 'numerical' },
  ],
  count: [
    { role: "category", label: "Category", type: 'categorical' },
  ],
  map: [ // Placeholder
    { role: "latitude", label: "Latitude", type: 'numerical' },
    { role: "longitude", label: "Longitude", type: 'numerical' },
    { role: "value", label: "Value", type: 'numerical' },
  ],
};
