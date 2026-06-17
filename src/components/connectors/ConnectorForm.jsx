import { useState, useEffect } from 'react';
import { Loader2, Plug, AlertCircle, Copy, Check, KeyRound, Eye, EyeOff } from 'lucide-react';
import { createOrUpdateConnector } from '../../services/connectorService';
import { getMetadata } from '../../services/metadataService';
import { getEventTypesForSource } from '../../utils/connectorEventTypes';

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
  const [enabledEventTypes, setEnabledEventTypes] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [registeredSecret, setRegisteredSecret] = useState(null);
  const [secretCopied, setSecretCopied] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);

  const availableEventTypes = getEventTypesForSource(source);

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

  function handleSourceChange(newSource) {
    setSource(newSource);
    setEnabledEventTypes([]);
  }

  function toggleEventType(eventType) {
    setEnabledEventTypes((prev) =>
      prev.includes(eventType)
        ? prev.filter((t) => t !== eventType)
        : [...prev, eventType]
    );
  }

  async function handleCopySecret() {
    if (!registeredSecret) return;
    await navigator.clipboard.writeText(registeredSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  }

  function handleDismissSecret() {
    setRegisteredSecret(null);
    setSecretVisible(false);
    setSecretCopied(false);
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
    setRegisteredSecret(null);

    try {
      const payload = {
        source,
        credentials: JSON.parse(credentials),
      };
      if (enabledEventTypes.length > 0) {
        payload.enabledEventTypes = enabledEventTypes;
      }
      const response = await createOrUpdateConnector(payload);
      setCredentials(JSON.stringify(defaultCredentials, null, 2));
      setEnabledEventTypes([]);
      if (response?.webhookSecret) {
        setRegisteredSecret(response.webhookSecret);
      }
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
          onChange={(e) => handleSourceChange(e.target.value)}
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

      {availableEventTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Event Types
          </label>
          <p className="text-xs text-text-muted mb-2">
            Leave all unchecked to accept all event types.
          </p>
          <div className="space-y-2">
            {availableEventTypes.map((eventType) => (
              <label
                key={eventType}
                className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={enabledEventTypes.includes(eventType)}
                  onChange={() => toggleEventType(eventType)}
                  className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
                />
                {eventType}
              </label>
            ))}
          </div>
        </div>
      )}

      {registeredSecret && (
        <div className="p-4 rounded-lg bg-warning-50 border border-warning-200 space-y-3">
          <div className="flex items-center gap-2 text-warning-800">
            <KeyRound size={16} />
            <span className="text-sm font-medium">Webhook Secret — Save this now!</span>
          </div>
          <p className="text-xs text-warning-700">
            This secret is shown only once. If you lose it, you must rotate credentials.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type={secretVisible ? 'text' : 'password'}
                value={registeredSecret}
                readOnly
                className="w-full px-3 py-2 pr-10 text-sm bg-white border border-warning-300 rounded-lg font-mono text-text-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSecretVisible((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {secretVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopySecret}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary bg-white border border-warning-300 rounded-lg hover:bg-warning-100 transition-colors"
            >
              {secretCopied ? <Check size={14} className="text-success-600" /> : <Copy size={14} />}
              {secretCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <button
            type="button"
            onClick={handleDismissSecret}
            className="text-xs text-warning-700 hover:text-warning-900 underline"
          >
            I have saved the secret — dismiss this message
          </button>
        </div>
      )}

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
