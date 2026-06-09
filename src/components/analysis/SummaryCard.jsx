import { useState } from 'react';
import { FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function SummaryCard({ summary, model, analyzedAt }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <FileText size={16} className="text-primary-600" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">AI Summary</h3>
        </div>
        <div className="flex items-center gap-1">
          {summary && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
              title={copied ? 'Copied' : 'Copy summary'}
            >
              {copied ? <Check size={14} className="text-success-600" /> : <Copy size={14} />}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-md hover:bg-border-light text-text-muted hover:text-text-primary transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3">
          {summary ? (
            <div className="bg-bg-base rounded-lg border border-border p-4">
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 bg-bg-base rounded-lg border border-border">
              <FileText size={20} className="text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">No summary available yet</p>
            </div>
          )}

          {(model || analyzedAt) && (
            <div className="flex items-center gap-4 text-xs text-text-muted">
              {model && <span>Model: {model}</span>}
              {analyzedAt && (
                <span>
                  Analyzed: {new Date(analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
