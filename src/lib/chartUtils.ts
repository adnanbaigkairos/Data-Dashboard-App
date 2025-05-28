import type { PlotConfig, CSVData, ColumnRole, PlotColumnConfig } from '@/types';

// Helper to get selected column name for a role
function getSelectedColumn(columns: PlotColumnConfig[], role: ColumnRole): string | undefined {
  return columns.find(c => c.role === role)?.columnName;
}

export function prepareChartData(originalData: CSVData['rows'], plotConfig: PlotConfig): any[] {
  const { type, columns } = plotConfig;

  switch (type) {
    case 'line': {
      const xAxisCol = getSelectedColumn(columns, 'xAxis');
      const yAxisCol = getSelectedColumn(columns, 'yAxis');
      if (!xAxisCol || !yAxisCol) return [];
      return originalData.map(row => ({
        [xAxisCol]: row[xAxisCol],
        [yAxisCol]: typeof row[yAxisCol] === 'string' ? parseFloat(row[yAxisCol] as string) : row[yAxisCol],
      })).filter(item => item[yAxisCol] !== undefined && !isNaN(item[yAxisCol] as number));
    }
    case 'bar': {
      const categoryCol = getSelectedColumn(columns, 'category');
      const valueCol = getSelectedColumn(columns, 'value');
      if (!categoryCol || !valueCol) return [];
      return originalData.map(row => ({
        [categoryCol]: row[categoryCol],
        [valueCol]: typeof row[valueCol] === 'string' ? parseFloat(row[valueCol] as string) : row[valueCol],
      })).filter(item => item[valueCol] !== undefined && !isNaN(item[valueCol] as number));
    }
    case 'pie': {
      const categoryCol = getSelectedColumn(columns, 'category');
      const valueCol = getSelectedColumn(columns, 'value');
      if (!categoryCol || !valueCol) return [];
      // Aggregate data for pie chart if necessary, or use as is if data is already aggregated
      // For simplicity, let's assume data might need aggregation for unique categories
      const aggregated: Record<string, number> = {};
      originalData.forEach(row => {
        const category = String(row[categoryCol]);
        const value = typeof row[valueCol] === 'string' ? parseFloat(row[valueCol] as string) : Number(row[valueCol]);
        if (!isNaN(value)) {
          aggregated[category] = (aggregated[category] || 0) + value;
        }
      });
      return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
    }
    case 'histogram': {
      const valueCol = getSelectedColumn(columns, 'value');
      if (!valueCol) return [];
      const values = originalData.map(row => Number(row[valueCol])).filter(v => !isNaN(v));
      if (values.length === 0) return [];

      // Basic histogram binning (simplified)
      const min = Math.min(...values);
      const max = Math.max(...values);
      const numBins = Math.min(10, Math.floor(Math.sqrt(values.length))); // Max 10 bins
      if (numBins === 0 || min === max) return [{ range: `${min}-${max}`, count: values.length }];
      const binSize = (max - min) / numBins;
      
      const bins = Array(numBins).fill(0).map((_, i) => {
        const binMin = min + i * binSize;
        const binMax = min + (i + 1) * binSize;
        return {
          range: `${binMin.toFixed(2)}-${binMax.toFixed(2)}`,
          count: 0,
          binMin,
          binMax
        };
      });

      values.forEach(value => {
        for (let i = 0; i < bins.length; i++) {
          if (value >= bins[i].binMin && (value < bins[i].binMax || (i === bins.length - 1 && value <= bins[i].binMax))) {
            bins[i].count++;
            break;
          }
        }
      });
      return bins.map(b => ({ range: b.range, count: b.count }));
    }
    case 'density': { // Approximated as an area chart showing counts or frequencies
      // This is a simplification. True density plots require kernel density estimation.
      // We'll do something similar to histogram but for an area chart.
      const valueCol = getSelectedColumn(columns, 'value');
      if (!valueCol) return [];
      const histData = prepareChartData(originalData, { ...plotConfig, type: 'histogram' });
      // Reformat for area chart: x = midpoint of range, y = count
      return histData.map(bin => {
        const [minStr, maxStr] = bin.range.split('-');
        const xValue = (parseFloat(minStr) + parseFloat(maxStr)) / 2;
        return { x: xValue, density: bin.count };
      });
    }
    case 'count': {
      const categoryCol = getSelectedColumn(columns, 'category');
      if (!categoryCol) return [];
      const counts: Record<string, number> = {};
      originalData.forEach(row => {
        const category = String(row[categoryCol]);
        counts[category] = (counts[category] || 0) + 1;
      });
      return Object.entries(counts).map(([category, count]) => ({ [categoryCol]: category, count }));
    }
    case 'map':
      // Placeholder: Map data processing would be complex.
      // For now, return a few sample points if columns are selected.
      const latCol = getSelectedColumn(columns, 'latitude');
      const lonCol = getSelectedColumn(columns, 'longitude');
      const valCol = getSelectedColumn(columns, 'value');
      if (!latCol || !lonCol || !valCol) return [{ message: "Map data not configured" }];
      return originalData.slice(0, 5).map(row => ({
        latitude: row[latCol],
        longitude: row[lonCol],
        value: row[valCol],
        tooltip: `${valCol}: ${row[valCol]}`
      })).filter(p => p.latitude && p.longitude);
    default:
      return [];
  }
}
