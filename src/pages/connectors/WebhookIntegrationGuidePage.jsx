import { useState } from 'react';
import {
  Webhook,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Info,
  ArrowLeft,
  Shield,
  KeyRound,
  Inbox,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';

const WEBHOOK_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/feedback/webhook`;

const STATUS_CODES = [
  {
    status: '400',
    code: 'INVALID_REQUEST',
    meaning: 'Missing source, signature, or empty payload',
  },
  {
    status: '401',
    code: 'INVALID_WEBHOOK_SIGNATURE',
    meaning: 'Signature is invalid or missing',
  },
  {
    status: '404',
    code: 'CONNECTOR_CONFIG_NOT_FOUND',
    meaning: 'No connector registered for this source',
  },
  {
    status: '429',
    code: 'RATE_LIMIT_EXCEEDED',
    meaning: 'Too many requests for this connector (20/min default)',
  },
  {
    status: '500',
    code: 'WEBHOOK_PAYLOAD_INVALID',
    meaning: 'Payload could not be parsed or normalized',
  },
];

const EVENT_TYPES = [
  { source: 'Instagram', events: 'comment_created, comment_deleted' },
  { source: 'WhatsApp', events: 'messages (or type from payload)' },
  { source: 'Zendesk', events: 'created, updated, solved' },
  { source: 'Typeform', events: 'form_response' },
  { source: 'Generic', events: 'event_type, event, type, action' },
];

function CodeBlock({ label, code, language }) {
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
        <code>{code}</code>
      </pre>
    </div>
  );
}

const NODE_EXAMPLE = `const crypto = require('crypto');

function signPayload(payload, secret) {
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  return \`sha256=\${signature}\`;
}

const payload = JSON.stringify({
  comment_id: "c123",
  text: "Love this product!",
  username: "johndoe"
});

const secret = 'your-webhook-secret-from-registration';
const signature = signPayload(payload, secret);

fetch('https://api.yourservice.com/api/v1/feedback/webhook?source=INSTAGRAM', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature
  },
  body: payload
});`;

const PYTHON_EXAMPLE = `import hmac
import hashlib
import json
import requests

def sign_payload(payload: str, secret: str) -> str:
    signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return f"sha256={signature}"

payload = json.dumps({
    "comment_id": "c123",
    "text": "Love this product!",
    "username": "johndoe"
})

secret = "your-webhook-secret-from-registration"
signature = sign_payload(payload, secret)

requests.post(
    "https://api.yourservice.com/api/v1/feedback/webhook?source=INSTAGRAM",
    headers={
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature
    },
    data=payload
)`;

const JAVA_EXAMPLE = `import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HexFormat;

public class WebhookSigner {
    public static String sign(String payload, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(), "HmacSHA256"));
        byte[] signature = mac.doFinal(payload.getBytes());
        return "sha256=" + HexFormat.of().formatHex(signature);
    }
}`;

export default function WebhookIntegrationGuidePage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <PageHeader
        title="Webhook Integration Guide"
        description="Learn how to send feedback from external systems using signed webhooks"
      >
        <button
          onClick={() => navigate('/connectors')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Connectors
        </button>
      </PageHeader>

      <div className="max-w-4xl space-y-10">
        {/* Endpoint Overview */}
        <section className="bg-bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Webhook size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Endpoint</h2>
              <p className="text-sm text-text-secondary">POST to the webhook endpoint with required headers</p>
            </div>
          </div>

          <CodeBlock
            label="Endpoint URL"
            code={`POST ${WEBHOOK_URL}?source={SOURCE}`}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-bg-base border border-border space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Required Headers</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 text-text-secondary font-mono text-xs">Content-Type</td>
                    <td className="py-2 text-text-primary">application/json</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-text-secondary font-mono text-xs">X-Webhook-Signature</td>
                    <td className="py-2 text-text-primary">sha256={'{hex}'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-lg bg-bg-base border border-border space-y-2">
              <h3 className="text-sm font-medium text-text-primary">Query Parameters</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 text-text-secondary font-mono text-xs">source</td>
                    <td className="py-2 text-text-primary">INSTAGRAM, WHATSAPP, ZENDESK, TYPEFORM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How to Generate Signature */}
        <section className="bg-bg-card rounded-xl border border-border p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
              <KeyRound size={20} className="text-success-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">How to Generate the Webhook Signature</h2>
              <p className="text-sm text-text-secondary">HMAC-SHA256 of the raw JSON payload using your connector secret</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-warning-50 border border-warning-200 text-sm text-warning-800 flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Important: Save your webhook secret immediately</p>
              <p className="text-warning-700">
                When you register a connector, the response includes a webhook secret. This is shown only once.
                If you lose it, you must rotate credentials via the delivery dashboard.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <CodeBlock label="Node.js Example" code={NODE_EXAMPLE} />
            <CodeBlock label="Python Example" code={PYTHON_EXAMPLE} />
            <CodeBlock label="Java Example" code={JAVA_EXAMPLE} />
          </div>
        </section>

        {/* Event Types */}
        <section className="bg-bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Inbox size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Supported Event Types by Source</h2>
              <p className="text-sm text-text-secondary">
                If enabledEventTypes is configured, only matching events are processed
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-base border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Event Types</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EVENT_TYPES.map((row) => (
                  <tr key={row.source} className="bg-bg-card hover:bg-bg-base transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{row.source}</td>
                    <td className="px-4 py-3 text-text-secondary font-mono text-xs">{row.events}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-text-muted">
            If enabledEventTypes is null or empty, all events are accepted. Unmatched events are silently accepted
            but not stored as feedback — the delivery is still tracked as successful.
          </p>
        </section>

        {/* Error Responses */}
        <section className="bg-bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-danger-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Error Responses</h2>
              <p className="text-sm text-text-secondary">Possible error codes and their meanings</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-base border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {STATUS_CODES.map((row) => (
                  <tr key={row.code} className="bg-bg-card hover:bg-bg-base transition-colors">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-danger-50 text-danger-700">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-primary">{row.code}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Delivery Dashboard Info */}
        <section className="bg-bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
              <Shield size={20} className="text-success-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Delivery Dashboard</h2>
              <p className="text-sm text-text-secondary">Monitor and manage webhook deliveries</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-bg-base border border-border space-y-3 text-sm text-text-secondary">
            <p>
              View all webhook deliveries for a connector via the{' '}
              <strong className="text-text-primary">Webhook Delivery Dashboard</strong>.
              You can filter by status, view error details, and replay failed deliveries.
            </p>
            <div className="font-mono text-xs bg-white p-3 rounded-lg border border-border space-y-1">
              <p>GET /api/v1/connectors/{'{connectorId}'}/webhooks/deliveries?status=FAILED</p>
              <p>POST /api/v1/connectors/{'{connectorId}'}/webhooks/deliveries/{'{deliveryId}'}/replay</p>
            </div>
            <button
              onClick={() => navigate('/connectors')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Inbox size={16} />
              Open Delivery Dashboard
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
