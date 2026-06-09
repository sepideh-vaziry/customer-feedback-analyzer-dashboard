import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadCsv } from '../../services/feedbackService';

const MAX_FILE_SIZE_MB = 10;

export default function CsvUploadForm() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return 'Only CSV files are allowed';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFile = (file) => {
    setError('');
    setResult(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setFile(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  function handleChange(e) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function clearFile() {
    setFile(null);
    setError('');
    setResult(null);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    try {
      const data = await uploadCsv(file);
      setResult(data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 size={28} className="text-success-500" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Upload Complete</h3>
            <p className="text-sm text-text-secondary">Your CSV has been processed.</p>
          </div>
        </div>

        <div className="bg-bg-base rounded-xl border border-border p-5 space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary">Total Rows</span>
            <span className="text-sm font-medium text-text-primary">{result.totalRows}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary">Successful Imports</span>
            <span className="text-sm font-medium text-success-600">{result.successCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary">Failed Imports</span>
            <span className="text-sm font-medium text-danger-600">{result.failureCount}</span>
          </div>
          {result.errors?.length > 0 && (
            <div className="pt-3 border-t border-border">
              <span className="text-sm text-text-secondary">Errors</span>
              <ul className="mt-2 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-danger-600">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={() => setResult(null)}
          className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Upload Another File
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-5">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : file
              ? 'border-success-300 bg-success-50'
              : 'border-border bg-bg-base hover:border-primary-300'
        }`}
      >
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileSpreadsheet size={24} className="text-success-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-secondary">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="p-1 rounded-md hover:bg-white/80 transition-colors"
            >
              <X size={16} className="text-text-secondary" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-border-light flex items-center justify-center mx-auto">
              <Upload size={24} className="text-text-muted" />
            </div>
            <p className="text-sm font-medium text-text-primary">
              Drag and drop your CSV file here
            </p>
            <p className="text-xs text-text-secondary">
              or click to browse. Max {MAX_FILE_SIZE_MB}MB.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={16} />
            Upload CSV
          </>
        )}
      </button>
    </div>
  );
}
