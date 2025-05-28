import type { CSVData } from '@/types';

// Basic CSV parser - limitations: doesn't handle commas in quotes, escaped characters, etc.
export function parseCSV(csvString: string): CSVData {
  const lines = csvString.trim().split(/\r?\n/); // Handles both \n and \r\n
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Basic quote and comma handling for headers
  const headerLine = lines[0];
  const headers = (headerLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [])
    .map(header => header.replace(/^"|"$/g, '').trim());
  
  const rows: Record<string, string | number>[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue; // Skip empty lines

    // Basic quote and comma handling for data rows
    const values = (lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [])
      .map(value => value.replace(/^"|"$/g, '').trim());

    if (values.length !== headers.length) {
      console.warn(`Skipping line ${i+1}: Number of values (${values.length}) does not match number of headers (${headers.length}). Line content: ${lines[i]}`);
      continue;
    }
    
    const row: Record<string, string | number> = {};
    headers.forEach((header, index) => {
      const value = values[index];
      // Attempt to convert to number if possible
      const numValue = parseFloat(value);
      row[header] = isNaN(numValue) || value.trim() === '' ? value : numValue;
    });
    rows.push(row);
  }
  return { headers, rows };
}
