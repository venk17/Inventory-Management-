import React, { useRef, useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { productAPI } from '../services/api';

const ImportExport = ({ onImportComplete }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await productAPI.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'products.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    try {
      setUploading(true);
      const result = await productAPI.importCsv(file);
      
      let message = `Import completed!\nAdded: ${result.added} products`;
      if (result.skipped > 0) {
        message += `\nSkipped: ${result.skipped} products`;
      }
      if (result.errors) {
        message += '\n\nErrors:\n' + result.errors.slice(0, 5).join('\n');
        if (result.errors.length > 5) {
          message += `\n... and ${result.errors.length - 5} more errors`;
        }
      }
      
      alert(message);
      onImportComplete();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed: ' + error.message);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleImportClick}
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {uploading ? 'Importing...' : 'Import CSV'}
      </button>
      
      <button
        onClick={handleExport}
        disabled={exporting}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {exporting ? 'Exporting...' : 'Export CSV'}
      </button>
    </div>
  );
};

export default ImportExport;