import Papa from 'papaparse';

export function parseCsv(text) {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return {
    rows: parsed.data || [],
    fields: parsed.meta.fields || [],
  };
}
