import { useEffect, useState } from 'react';
import { Database, RefreshCw, Upload, ChevronDown, Check } from 'lucide-react';
import { getSchemas } from '../../services/queryGeneratorService';

const STATUS_STYLES = {
  PENDING: 'bg-slate-100 text-slate-600',
  VALID: 'bg-success-50 text-success-700 border border-success-200',
  INVALID: 'bg-danger-50 text-danger-700 border border-danger-200',
  ANALYZING: 'bg-warning-50 text-warning-700 border border-warning-200',
  ANALYZED: 'bg-primary-50 text-primary-700 border border-primary-200',
};

export default function SchemaSelector({
  schemas,
  selectedSchema,
  loading,
  onSelect,
  onRefresh,
  onUploadClick,
  error,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [open]);

  const handleSelect = (schema) => {
    onSelect(schema);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-text-secondary">Database Schema</label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Upload size={12} />
            Upload
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-bg-hover transition-colors disabled:opacity-50"
            aria-label="Refresh schemas"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={loading && !schemas.length}
          className="flex items-center justify-between w-full px-4 py-3 text-left bg-bg-base border border-border rounded-xl hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {selectedSchema ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                <Database size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">
                  {selectedSchema.name}
                </div>
                <div className="text-xs text-text-muted">
                  {selectedSchema.databaseType} · {selectedSchema.tableCount ?? 0} tables
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-400">
                <Database size={16} />
              </div>
              <span className="text-sm text-text-muted">
                {loading ? 'Loading schemas...' : 'Select a schema'}
              </span>
            </div>
          )}
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute z-20 mt-1.5 w-full bg-bg-card border border-border rounded-xl shadow-lg max-h-72 overflow-y-auto animate-fade-in">
            {schemas.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-text-muted">
                {error ? (
                  <span className="text-danger-600">{error}</span>
                ) : (
                  <>
                    No schemas yet.
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        onUploadClick();
                      }}
                      className="ml-1 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      Upload one
                    </button>
                  </>
                )}
              </div>
            ) : (
              schemas.map((schema) => {
                const isSelected = selectedSchema?.id === schema.id;
                return (
                  <button
                    key={schema.id}
                    type="button"
                    onClick={() => handleSelect(schema)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-bg-hover transition-colors border-b border-border-light last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                        <Database size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-text-primary truncate">
                          {schema.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {schema.databaseType} · {schema.tableCount ?? 0} tables
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[schema.status] || STATUS_STYLES.PENDING}`}
                      >
                        {schema.status}
                      </span>
                      {isSelected && <Check size={14} className="text-primary-600" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
