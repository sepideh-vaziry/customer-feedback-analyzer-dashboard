import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, FileText, Calendar, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import InvoiceDetailsDrawer from '../../components/billing/InvoiceDetailsDrawer';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getInvoices } from '../../services/billingService';

const statusConfig = {
  PAID: { label: 'Paid', className: 'bg-success-50 text-success-700 border-success-200' },
  PENDING: { label: 'Pending', className: 'bg-warning-50 text-warning-700 border-warning-200' },
  FAILED: { label: 'Failed', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  REFUNDED: { label: 'Refunded', className: 'bg-primary-50 text-primary-700 border-primary-200' },
};

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInvoices();
      setInvoices(data || []);
    } catch (err) {
      setError('Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Invoices"
        description="View and download your billing history"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-xl hover:border-primary-300 transition-all duration-200 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2 font-medium">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {loading && invoices.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices"
          description="Invoices will appear here once billing cycles are completed."
        />
      ) : (
        <div className="bg-bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <table className="w-full text-sm">
            <thead className="bg-bg-base border-b border-border">
              <tr>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Invoice #</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Due Date</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3.5 font-semibold text-text-secondary text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.invoiceStatus] || { label: invoice.invoiceStatus || 'Unknown', className: 'bg-bg-base text-text-secondary border-border' };

                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-bg-base/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-sm">
                          <FileText size={14} className="text-primary-600" />
                        </div>
                        <span className="font-semibold text-text-primary">{invoice.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary font-medium">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-text-primary">
                      {invoice.currency || '$'}{invoice.amount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-border-light text-text-muted hover:text-text-primary transition-colors">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceDetailsDrawer
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </DashboardLayout>
  );
}
