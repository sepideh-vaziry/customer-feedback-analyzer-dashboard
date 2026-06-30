import { useState } from 'react';
import { X, Upload, Database, Loader2 } from 'lucide-react';
import { uploadSchema } from '../../services/queryGeneratorService';

const DATABASE_TYPES = [
  { value: 'POSTGRESQL', label: 'PostgreSQL' },
  { value: 'MYSQL', label: 'MySQL' },
  { value: 'SQL_SERVER', label: 'SQL Server' },
  { value: 'SQLITE', label: 'SQLite' },
];

const EMPTY_FORM = {
  schemaName: '',
  databaseType: 'POSTGRESQL',
  rawDdl: '',
  description: '',
};

export default function SchemaUploadDialog({ open, onClose, onUploaded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.databaseType) {
      setError('Database type is required.');
      return;
    }
    if (!form.schemaName.trim()) {
      setError('Schema name is required.');
      return;
    }
    if (!form.rawDdl.trim()) {
      setError('Schema DDL is required.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await uploadSchema(form);
      setForm(EMPTY_FORM);
      onUploaded(result);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to upload schema.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-bg-card rounded-2xl shadow-xl border border-border animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Upload Database Schema</h2>
              <p className="text-xs text-text-muted">Provide DDL so the AI can generate SQL against it.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Schema Name <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={form.schemaName}
                onChange={(e) => update('schemaName', e.target.value)}
                placeholder="e.g., Production DB"
                maxLength={100}
                className="input w-full"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">
                Database Type <span className="text-danger-500">*</span>
              </label>
              <select
                value={form.databaseType}
                onChange={(e) => update('databaseType', e.target.value)}
                className="input w-full"
                disabled={submitting}
              >
                {DATABASE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1.5">
              Schema DDL <span className="text-danger-500">*</span>
            </label>
            <textarea
              value={form.rawDdl}
              onChange={(e) => update('rawDdl', e.target.value)}
              placeholder="CREATE TABLE customers (id BIGINT PRIMARY KEY, ...);"
              rows={10}
              className="input w-full font-mono text-xs resize-y"
              disabled={submitting}
            />
            <p className="mt-1.5 text-xs text-text-muted">
              Paste your DDL (CREATE TABLE statements). Max 5 MB.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1.5">
              Description <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Short note about this schema"
              className="input w-full"
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {submitting ? 'Uploading...' : 'Upload Schema'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
