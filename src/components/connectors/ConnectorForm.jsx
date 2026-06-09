import { useState, useEffect } from 'react';
import { Loader2, Plug, AlertCircle } from 'lucide-react';
import { createOrUpdateConnector } from '../../services/connectorService';
import { getMetadata } from '../../services/metadataService';

const defaultCredentials = {
  apiToken: '',
  subdomain: '',
};

export default function ConnectorForm({ onSuccess }) {
  const [sources, setSources] = useState([]);
  const [source, setSource] = useState('');
  const [credentials, setCredentials] = useState(() =>
    JSON.stringify(defaultCredentials, null, 2)
  );
  const [loadingSources, setLoadingSources] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getMetadata();
        setSources(data.feedbackSources || []);
        if (data.feedbackSources?.length > 0) {
          setSource(data.feedbackSources[0].key);
        }
      } catch {
        setSources([]);
      } finally {
        setLoadingSources(false);
      }
    }
    load();
  }, []);

  function validateJson(value) {
    try {
      JSON.parse(value);
      return null;
    } catch {
      return 'Invalid JSON format';
    }
  }

  function handleCredentialsChange(e) {
    const value = e.target.value;
    setCredentials(value);
    const err = validateJson(value);
    setJsonError(err || '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const jsonErr = validateJson(credentials);
    if (jsonErr) {
      setJsonError(jsonErr);
      return;
    }
    if (!source) {
      setError('Please select a source');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createOrUpdateConnector({
        source,
        credentials: JSON.parse(credentials),
      });
      setCredentials(JSON.stringify(defaultCredentials, null, 2));
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save connector');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="connector-source" className="block text-sm font-medium text-text-primary mb-1.5">
          Source
        </label>
        <select
          id="connector-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          disabled={loadingSources}
          className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        >
          {loadingSources ? (
            <option>Loading sources...</option>
          ) : sources.length === 0 ? (
            <option>No sources available</option>
          ) : (
            sources.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <label htmlFor="connector-credentials" className="block text-sm font-medium text-text-primary mb-1.5">
          Credentials (JSON)
        </label>
        <textarea
          id="connector-credentials"
          rows={8}
          value={credentials}
          onChange={handleCredentialsChange}
          className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none font-mono leading-relaxed ${
            jsonError ? 'border-danger-300' : 'border-border'
          }`}
        />
        {jsonError && <p className="mt-1.5 text-xs text-danger-600">{jsonError}</p>}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !!jsonError}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Plug size={16} />
            Save Connector
          </>
        )}
      </button>
    </form>
  );
}
