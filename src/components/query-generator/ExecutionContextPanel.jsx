import { useState } from 'react';
import {
  Info,
  Table as TableIcon,
  Columns3,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

function ConfidenceBadge({ score }) {
  const pct = score != null ? Math.round(score * 100) : null;
  if (pct == null) return null;
  const color = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'danger';
  const cls = {
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-danger-50 text-danger-700 border-danger-200',
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${cls}`}>
      <ShieldCheck size={12} />
      {pct}% confidence
    </span>
  );
}

export default function ExecutionContextPanel({ query }) {
  const [showTables, setShowTables] = useState(true);
  const [showColumns, setShowColumns] = useState(false);

  if (!query) return null;

  const {
    generatedAt,
    generationModel,
    usedTables = [],
    usedColumns = [],
    confidenceScore,
  } = query;

  const hasMeta = generatedAt || generationModel || usedTables.length || usedColumns.length;

  if (!hasMeta) return null;

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-50 text-accent-600">
            <Info size={16} />
          </div>
          <h3 className="text-base font-bold text-text-primary">Execution Context</h3>
        </div>
        <ConfidenceBadge score={confidenceScore} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {generationModel && (
          <div className="p-3 rounded-xl border border-border bg-bg-base">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-text-muted">Model</div>
            <div className="text-sm font-semibold text-text-primary mt-0.5">{generationModel}</div>
          </div>
        )}
        {generatedAt && (
          <div className="p-3 rounded-xl border border-border bg-bg-base">
            <div className="text-[11px] uppercase tracking-wide font-semibold text-text-muted">Generated At</div>
            <div className="text-sm font-semibold text-text-primary mt-0.5">
              {new Date(generatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {usedTables.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setShowTables(!showTables)}
            className="flex items-center justify-between w-full px-4 py-2.5 text-left text-sm font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <TableIcon size={14} className="text-primary-600" />
              Tables Used
              <span className="text-xs font-semibold text-text-muted">({usedTables.length})</span>
            </span>
            {showTables ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showTables && (
            <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5">
              {usedTables.map((t, idx) => (
                <span
                  key={`${t}-${idx}`}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold text-primary-700 bg-primary-50 border border-primary-200 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {usedColumns.length > 0 && (
        <div className="mt-3 rounded-xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setShowColumns(!showColumns)}
            className="flex items-center justify-between w-full px-4 py-2.5 text-left text-sm font-semibold text-text-secondary hover:bg-bg-hover transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <Columns3 size={14} className="text-accent-600" />
              Columns Used
              <span className="text-xs font-semibold text-text-muted">({usedColumns.length})</span>
            </span>
            {showColumns ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showColumns && (
            <div className="px-4 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
              {usedColumns.map((c, idx) => (
                <span
                  key={`${c}-${idx}`}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold text-accent-700 bg-accent-50 border border-accent-200 rounded-md truncate"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {!generationModel && !generatedAt && usedTables.length === 0 && usedColumns.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <AlertCircle size={14} />
          No execution context metadata available.
        </div>
      )}
    </div>
  );
}
