import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const supportedTypes = {
  csv: { label: 'CSV', extensions: ['csv'] },
  tsv: { label: 'TSV', extensions: ['tsv'] },
  xlsx: { label: 'Excel', extensions: ['xlsx', 'xls'] },
  pdf: { label: 'PDF', extensions: ['pdf'] },
  json: { label: 'JSON', extensions: ['json'] },
  txt: { label: 'Text', extensions: ['txt'] },
  sql: { label: 'Sql', extensions: ['sql'] },
};//ona les types des fichiers suportes et leur extensions

function detectType(fileName, mimeType = '') {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';// Extract the file extension from the file name
  const normalizedMime = mimeType.toLowerCase();// Normalize the MIME type for comparison

  if (extension === 'csv') return 'csv';
  if (extension === 'tsv') return 'tsv';
  if (['xlsx', 'xls'].includes(extension)) return 'xlsx';
  if (extension === 'pdf' || normalizedMime.includes('pdf')) return 'pdf';
  if (extension === 'json' || normalizedMime.includes('json')) return 'json';
  if (extension === 'txt' || normalizedMime.includes('text')) return 'txt';
  if (extension === 'sql' || normalizedMime.includes('sql')) return 'sql';// Check for SQL files based on extension or MIME type

  return null;
}
// Function transform csv to json .
function parseCsvText(text) {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  return {
    rows: parsed.data || [],
    fields: parsed.meta.fields || [],
  };
}
// from exel to json 

async function parseExcelFile(file) {
  const buffer = await file.arrayBuffer();//le transforme en binaire
  const workbook = XLSX.read(buffer, { type: 'array' });//il lit le execl
  const sheetName = workbook.SheetNames[0];//il recupere la permiere feuille de fichier
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });//il le converti vers json
  return { rows, fields: rows.length ? Object.keys(rows[0]) : [] }; //retoure de data
}

async function parsePdfFile(file) {
  const buffer = await file.arrayBuffer();//le transforme en binaire
  const pdf = await getDocument({ data: buffer }).promise; //il lit le fichier pdf
  let text = '';

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex); // il recupere la page du pdf
    const content = await page.getTextContent();//il recupere le contenue de la page
    text += content.items.map((item) => item.str).join(' ') + '\n';//chainage de mots
 
}

  return { rows: [{ preview: text.slice(0, 500) }], fields: ['preview'] };
}

function parseJsonFile(text) {
  const parsed = JSON.parse(text);//transfoeme le text en json
  const rows = Array.isArray(parsed) ? parsed : [parsed]; //si il est pas tableau il le transforme en tableau
  const fields = rows.length ? Object.keys(rows[0]) : [];
  return { rows, fields };
}

function parseTextFile(text) {
    
  const lines = text.split(/\r?\n/).filter(Boolean);
  return {
    rows: lines.map((line) => ({ preview: line })),
    fields: ['preview'],
  };
}

function DataImportPanel({ onImport }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectedType, setDetectedType] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [previewFields, setPreviewFields] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [mapping, setMapping] = useState({ question: 'question', answer: 'answer', category: 'category', status: 'status' });

  const supportedExtensions = useMemo(() => Object.values(supportedTypes).flatMap((type) => type.extensions).join(', '), []);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = detectType(file.name, file.type);
    setSelectedFile(file);
    setDetectedType(type);
    setStatusMessage(`Detected ${type ? supportedTypes[type]?.label || type : 'unsupported'} file`);

    if (!type) {
      setPreviewRows([]);
      setPreviewFields([]);
      setStatusMessage('Unsupported file type. Please upload CSV, Excel, PDF, JSON, or TXT.');
      return;
    }

    setIsParsing(true);
    try {
      const text = await file.text();
      let parsed;
      if (type === 'csv' || type === 'tsv') {
        parsed = parseCsvText(text);
      } else if (type === 'xlsx') {
        parsed = await parseExcelFile(file);
      } else if (type === 'pdf') {
        parsed = await parsePdfFile(file);
      } else if (type === 'json') {
        parsed = parseJsonFile(text);
      } else {
        parsed = parseTextFile(text);
      }

      setPreviewRows(parsed.rows.slice(0, 5));
      setPreviewFields(parsed.fields);
      setStatusMessage(`Parsed ${parsed.rows.length} row(s). Review the mapping before importing.`);
    } catch (error) {
      setStatusMessage(error.message || 'Unable to parse the selected file.');
      setPreviewRows([]);
      setPreviewFields([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommit = () => {
    if (!selectedFile || previewRows.length === 0) {
      setStatusMessage('Upload and parse a file before importing.');
      return;
    }

    onImport({ fileName: selectedFile.name, detectedType, rows: previewRows, mapping });
    setStatusMessage('Import ready. FAQ data will be used for the dashboard.');
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Import data</h2>
          <p className="mt-1 text-sm text-slate-500">this data used by open ai api to responce costumer.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-within:ring-2 focus-within:ring-sky-500">
          <input type="file" accept={supportedExtensions} className="sr-only" onChange={handleFileChange} />
          Upload file
        </label>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-700">Supported formats</p>
        <p className="mt-1">{supportedExtensions}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Upload state</p>
          <p className="mt-2 text-sm text-slate-500">{selectedFile ? `File: ${selectedFile.name}` : 'No file selected yet'}</p>
          <p className="mt-1 text-sm text-slate-500">Type: {detectedType ? supportedTypes[detectedType]?.label || detectedType : 'Pending'}</p>
          <p className="mt-1 text-sm text-slate-500">Preview rows: {previewRows.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Mapping preview</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {['question', 'answer', 'category', 'status'].map((field) => (
              <label key={field} className="flex items-center justify-between gap-3">
                <span className="capitalize">{field}</span>
                <select
                  value={mapping[field] || ''}
                  onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value }))}
                  className="rounded-xl border border-slate-300 bg-white px-2 py-1 text-sm"
                >
                  <option value="">—</option>
                  {previewFields.map((candidate) => (
                    <option key={candidate} value={candidate}>{candidate}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
      </div>

      {isParsing && <p className="mt-4 text-sm text-sky-600">Parsing file…</p>}
      {statusMessage && <p className="mt-4 text-sm text-slate-600">{statusMessage}</p>}

      {previewRows.length > 0 && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {previewFields.map((field) => (
                  <th key={field} scope="col" className="px-3 py-2 font-semibold text-slate-700">
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {previewRows.map((row, index) => (
                <tr key={`${row[previewFields[0]] || index}-${index}`}>
                  {previewFields.map((field) => (
                    <td key={field} className="whitespace-nowrap px-3 py-2 text-slate-600">
                      {String(row[field] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={handleCommit}
        className="mt-5 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        Review import
      </button>
    </section>
  );
}

DataImportPanel.propTypes = {
  onImport: PropTypes.func.isRequired,
};

export default DataImportPanel;
