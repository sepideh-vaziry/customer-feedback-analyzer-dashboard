import { Loader2, PlayCircle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function ExecutionResultPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs flex items-center gap-3">
        <Loader2 size={18} className="animate-spin text-primary-600" />
        <div>
          <div className="text-sm font-semibold text-text-primary">Executing query...</div>
          <div className="text-xs text-text-muted">Waiting for the database to return results.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bg-card rounded-2xl border border-danger-200 bg-danger-50/40 p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-danger-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-danger-700">Execution Failed</div>
            <div className="text-xs text-danger-600 mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const failed = !!result.errorMessage;
  const rows = parseRows(result.executionResult);
  const hasRows = rows.length > 0;

  return (
    <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        {failed ? (
          <AlertCircle size={16} className="text-danger-600" />
        ) : (
          <CheckCircle2 size={16} className="text-success-600" />
        )}
        <h3 className="text-base font-bold text-text-primary">Execution Result</h3>
        {result.executionDurationMs != null && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted bg-bg-base border border-border px-2 py-0.5 rounded-full">
            <Clock size={10} />
            {result.executionDurationMs} ms
          </span>
        )}
      </div>

      {failed ? (
        <div className="p-3 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 font-medium">
          {result.errorMessage}
        </div>
      ) : hasRows ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                {Object.keys(rows[0]).map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-bg-hover">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-3 py-2 text-text-primary whitespace-nowrap">
                      {val === null || val === undefined ? '-' : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <PlayCircle size={14} />
          Query executed successfully — no rows returned.
        </div>
      )}
    </div>
  );
}

function parseRows(executionResult) {
  if (!executionResult) return [];
  if (Array.isArray(executionResult)) return executionResult;
  if (typeof executionResult === 'string') {
    try {
      const parsed = JSON.parse(executionResult);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}
