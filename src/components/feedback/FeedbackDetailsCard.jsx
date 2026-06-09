import { User, Mail, Fingerprint, Calendar, Hash, Layers, FileText } from 'lucide-react';
import FeedbackStatusBadge from './FeedbackStatusBadge';

export default function FeedbackDetailsCard({ feedback }) {
  if (!feedback) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const sections = [
    {
      title: 'General Information',
      icon: Hash,
      fields: [
        { label: 'ID', value: feedback.id },
        { label: 'Source', value: feedback.source },
        { label: 'Status', value: <FeedbackStatusBadge status={feedback.status} /> },
        { label: 'Created At', value: formatDate(feedback.createdAt) },
      ],
    },
    {
      title: 'Customer Information',
      icon: User,
      fields: [
        { label: 'Identifier', value: feedback.customerIdentifier || '—', icon: Fingerprint },
        { label: 'Name', value: feedback.customerName || '—', icon: User },
        { label: 'Email', value: feedback.customerEmail || '—', icon: Mail },
      ],
    },
    {
      title: 'Feedback Content',
      icon: FileText,
      content: feedback.content || 'No content available.',
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-bg-card rounded-xl border border-border p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <section.icon size={16} className="text-primary-600" />
            </div>
            <h3 className="text-base font-semibold text-text-primary">{section.title}</h3>
          </div>

          {section.fields && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.label} className="space-y-1">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    {field.label}
                  </p>
                  <div className="text-sm text-text-primary">
                    {typeof field.value === 'string' ? (
                      <span className="font-mono text-xs">{field.value}</span>
                    ) : (
                      field.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.content && (
            <div className="bg-bg-base rounded-lg border border-border p-4">
              <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
                {section.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
