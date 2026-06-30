import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Wand2,
  Sparkles,
  Play,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Lightbulb,
  FileCode2,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import SchemaSelector from '../../components/query-generator/SchemaSelector';
import SchemaUploadDialog from '../../components/query-generator/SchemaUploadDialog';
import QueryInput from '../../components/query-generator/QueryInput';
import SqlViewer from '../../components/query-generator/SqlViewer';
import QueryOptimizations from '../../components/query-generator/QueryOptimizations';
import ExecutionContextPanel from '../../components/query-generator/ExecutionContextPanel';
import ExecutionResultPanel from '../../components/query-generator/ExecutionResultPanel';
import {
  getSchemas,
  generateQuery,
  executeQuery,
} from '../../services/queryGeneratorService';

export default function QueryGeneratorPage() {
  const [schemas, setSchemas] = useState([]);
  const [schemasLoading, setSchemasLoading] = useState(false);
  const [schemasError, setSchemasError] = useState('');
  const [selectedSchema, setSelectedSchema] = useState(null);

  const [uploadOpen, setUploadOpen] = useState(false);

  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [intent, setIntent] = useState('SELECT');
  const [explain, setExplain] = useState(true);
  const [optimize, setOptimize] = useState(true);

  const [generated, setGenerated] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const [execution, setExecution] = useState({ result: null, loading: false, error: '' });

  const loadSchemas = useCallback(async () => {
    setSchemasLoading(true);
    setSchemasError('');
    try {
      const data = await getSchemas();
      const list = data?.schemas || [];
      setSchemas(list);
      setSelectedSchema((prev) => {
        if (prev && list.some((s) => s.id === prev.id)) return prev;
        return null;
      });
    } catch (err) {
      setSchemasError(err?.response?.data?.message || err?.message || 'Failed to load schemas.');
    } finally {
      setSchemasLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchemas();
  }, [loadSchemas]);

  const canGenerate = useMemo(
    () =>
      !!selectedSchema &&
      naturalLanguage.trim().length > 0 &&
      !!intent &&
      !generating,
    [selectedSchema, naturalLanguage, intent, generating]
  );

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    setGenerateError('');
    setGenerated(null);
    setExecution({ result: null, loading: false, error: '' });
    try {
      const result = await generateQuery(selectedSchema.id, {
        naturalLanguageQuery: naturalLanguage.trim(),
        intent,
        explainQuery: explain,
        optimizeQuery: optimize,
      });
      setGenerated(result);
    } catch (err) {
      setGenerateError(err?.response?.data?.message || err?.message || 'Failed to generate query.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExecute = async () => {
    if (!generated?.queryId) return;
    setExecution({ result: null, loading: true, error: '' });
    try {
      const result = await executeQuery(generated.queryId);
      setExecution({ result, loading: false, error: '' });
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Execution failed.';
      setExecution({ result: null, loading: false, error: message });
    }
  };

  const handleClear = () => {
    setGenerated(null);
    setGenerateError('');
    setExecution({ result: null, loading: false, error: '' });
  };

  const handleUploaded = () => {
    loadSchemas();
  };

  const confidence = generated?.confidenceScore;
  const confidencePct = confidence != null ? Math.round(confidence * 100) : null;

  return (
    <DashboardLayout>
      <PageHeader
        title="SQL Query Generator"
        description="Describe what you need in plain English — get runnable SQL against your schema."
      >
        <button
          onClick={handleClear}
          disabled={!generated && !naturalLanguage}
          className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={14} />
          Clear
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — input */}
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <span className="text-xs font-bold text-primary-700">1</span>
            </div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Configure
            </h2>
          </div>

          <SchemaSelector
            schemas={schemas}
            selectedSchema={selectedSchema}
            loading={schemasLoading}
            onSelect={setSelectedSchema}
            onRefresh={loadSchemas}
            onUploadClick={() => setUploadOpen(true)}
            error={schemasError}
          />

          <div className="h-px bg-border-light" />

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent-50 text-accent-600">
              <span className="text-xs font-bold text-accent-700">2</span>
            </div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Describe
            </h2>
          </div>

          <QueryInput
            value={naturalLanguage}
            onChange={setNaturalLanguage}
            intent={intent}
            onIntentChange={setIntent}
            explain={explain}
            optimize={optimize}
            onExplainChange={setExplain}
            onOptimizeChange={setOptimize}
            disabled={!selectedSchema}
          />

          {generateError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 font-medium">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {generateError}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Generate SQL
              </>
            )}
          </button>
        </div>

        {/* Right — output */}
        <div className="space-y-6">
          {generating && (
            <div className="bg-bg-card rounded-2xl border border-border p-10 shadow-xs flex flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="animate-spin text-primary-600" />
              <div className="text-sm font-semibold text-text-primary">Generating SQL...</div>
              <div className="text-xs text-text-muted">The model is reasoning over your schema.</div>
            </div>
          )}

          {!generating && !generated && (
            <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs">
              <EmptyState
                icon={FileCode2}
                title="No SQL generated yet"
                description={
                  selectedSchema
                    ? 'Describe your query on the left and click Generate SQL.'
                    : 'Select or upload a database schema to begin.'
                }
                action={
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Sparkles size={12} className="text-primary-400" />
                    Tip: try an example query from the list.
                  </div>
                }
              />
            </div>
          )}

          {generated && !generating && (
            <>
              <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-success-50 text-success-600">
                      <FileCode2 size={16} />
                    </div>
                    <h3 className="text-base font-bold text-text-primary">Generated SQL</h3>
                  </div>
                  {confidencePct != null && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        confidencePct >= 80
                          ? 'bg-success-50 text-success-700 border-success-200'
                          : confidencePct >= 60
                            ? 'bg-warning-50 text-warning-700 border-warning-200'
                            : 'bg-danger-50 text-danger-700 border-danger-200'
                      }`}
                    >
                      {confidencePct}% confidence
                    </span>
                  )}
                </div>

                <SqlViewer
                  sql={generated.generatedSql}
                  databaseType={selectedSchema?.databaseType}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExecute}
                    disabled={execution.loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-success-600 hover:bg-success-700 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {execution.loading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Play size={12} />
                    )}
                    Execute Query
                  </button>
                </div>
              </div>

              {generated.explanation && (
                <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
                      <Lightbulb size={16} />
                    </div>
                    <h3 className="text-base font-bold text-text-primary">Explanation</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {generated.explanation}
                  </p>
                </div>
              )}

              <QueryOptimizations suggestions={generated.suggestions} />

              <ExecutionContextPanel query={generated} />

              <ExecutionResultPanel
                result={execution.result}
                loading={execution.loading}
                error={execution.error}
              />
            </>
          )}
        </div>
      </div>

      <SchemaUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />
    </DashboardLayout>
  );
}
