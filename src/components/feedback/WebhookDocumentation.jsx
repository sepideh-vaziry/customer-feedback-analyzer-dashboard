import { useState } from 'react';
import { Copy, Check, Webhook } from 'lucide-react';

const WEBHOOK_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/feedback/webhook`;

const PAYLOAD_EXAMPLE = {
  source: 'WEBHOOK',
  payload: '{"message":"Great service!"}',
  apiKey: 'your-api-key',
};

function CodeBlock({ label, code, isJson }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-base hover:bg-border-light rounded-md transition-colors"
        >
          {copied ? <Check size={14} className="text-success-500" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-bg-sidebar text-text-inverse p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{isJson ? JSON.stringify(code, null, 2) : code}</code>
      </pre>
    </div>
  );
}

export default function WebhookDocumentation() {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
          <Webhook size={20} className="text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Webhook Integration</h3>
          <p className="text-sm text-text-secondary">
            Send feedback programmatically from any external system.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <CodeBlock label="Webhook URL" code={`POST ${WEBHOOK_URL}`} isJson={false} />
        <CodeBlock label="Required Payload" code={PAYLOAD_EXAMPLE} isJson={true} />
      </div>

      <div className="bg-bg-base rounded-xl border border-border p-5 space-y-3">
        <h4 className="text-sm font-semibold text-text-primary">Integration Notes</h4>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
            Include your API key in the <code className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">apiKey</code> field.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
            The <code className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">payload</code> field accepts any JSON string.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
            Set <code className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">source</code> to <code className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">WEBHOOK</code>.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
            All requests must use <code className="px-1.5 py-0.5 bg-white rounded text-xs font-mono">Content-Type: application/json</code>.
          </li>
        </ul>
      </div>
    </div>
  );
}
