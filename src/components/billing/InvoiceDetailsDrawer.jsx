import { X, Download, Calendar, CreditCard, FileText } from 'lucide-react';

const statusConfig = {
  PAID: { label: 'Paid', className: 'bg-success-50 text-success-700 border-success-200' },
  PENDING: { label: 'Pending', className: 'bg-warning-50 text-warning-700 border-warning-200' },
  FAILED: { label: 'Failed', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  REFUNDED: { label: 'Refunded', className: 'bg-primary-50 text-primary-700 border-primary-200' },
};

export default function InvoiceDetailsDrawer({ invoice, onClose }) {
  if (!invoice) return null;

  const status = statusConfig[invoice.invoiceStatus] || { label: invoice.invoiceStatus || 'Unknown', className: 'bg-bg-base text-text-secondary border-border' };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Invoice Details</h2>
              <p className="text-sm text-text-muted mt-1">{invoice.invoiceNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="mb-6">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
              {status.label}
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg-base border border-border">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-primary-500" />
                <span className="text-sm text-text-secondary">Amount</span>
              </div>
              <span className="text-lg font-semibold text-text-primary">
                {invoice.currency || '$'}{invoice.amount?.toFixed(2) || '0.00'}
              </span>
            </div>

            {invoice.subtotal != null && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-base border border-border">
                <span className="text-sm text-text-secondary">Subtotal</span>
                <span className="text-sm font-medium text-text-primary">
                  {invoice.currency || '$'}{invoice.subtotal.toFixed(2)}
                </span>
              </div>
            )}

            {invoice.taxAmount != null && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-base border border-border">
                <span className="text-sm text-text-secondary">Tax</span>
                <span className="text-sm font-medium text-text-primary">
                  {invoice.currency || '$'}{invoice.taxAmount.toFixed(2)}
                </span>
              </div>
            )}

            {invoice.discountAmount != null && invoice.discountAmount > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-base border border-border">
                <span className="text-sm text-text-secondary">Discount</span>
                <span className="text-sm font-medium text-success-600">
                  -{invoice.currency || '$'}{invoice.discountAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            {invoice.companyName && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <CreditCard size={14} />
                {invoice.companyName}
              </div>
            )}
            {invoice.createdAt && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar size={14} />
                Created: {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
            )}
            {invoice.paidAt && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar size={14} />
                Paid: {new Date(invoice.paidAt).toLocaleDateString()}
              </div>
            )}
            {invoice.dueDate && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar size={14} />
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            )}
            {invoice.paymentProvider && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <CreditCard size={14} />
                Payment: {invoice.paymentProvider}
              </div>
            )}
          </div>

          {invoice.pdfUrl && (
            <a
              href={invoice.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Download size={14} />
              Download PDF
            </a>
          )}
        </div>
      </div>
    </>
  );
}
