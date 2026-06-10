import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Save, Settings, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getGlobalSettings, updateGlobalSettings } from '../../services/adminService';

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGlobalSettings();
      setSettings(data || {});
    } catch (err) {
      setError(err.message || 'Failed to load global settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateGlobalSettings(settings);
      setSuccess('Settings saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const booleanFields = Object.entries(settings).filter(([, v]) => typeof v === 'boolean');
  const textFields = Object.entries(settings).filter(([, v]) => typeof v === 'string');
  const numberFields = Object.entries(settings).filter(([, v]) => typeof v === 'number');

  return (
    <AdminLayout>
      <PageHeader
        title="Global Settings"
        description="Configure platform-wide settings"
      >
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-card border border-border rounded-lg hover:border-primary-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-danger-50 border border-danger-200 text-sm text-danger-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-success-50 border border-success-200 text-sm text-success-700 flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {booleanFields.length === 0 && textFields.length === 0 && numberFields.length === 0 ? (
            <div className="bg-bg-card rounded-xl border border-border p-8 text-center">
              <Settings size={40} className="mx-auto text-text-muted mb-3" />
              <h3 className="text-sm font-medium text-text-primary">No settings available</h3>
              <p className="text-sm text-text-muted mt-1">
                Global settings will appear here once the backend API is implemented.
              </p>
            </div>
          ) : (
            <>
              {booleanFields.length > 0 && (
                <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Toggle Settings</h3>
                  <div className="space-y-4">
                    {booleanFields.map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <label className="text-sm text-text-secondary capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <button
                          onClick={() => handleChange(key, !value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? 'bg-primary-600' : 'bg-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {textFields.length > 0 && (
                <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Text Settings</h3>
                  <div className="space-y-4">
                    {textFields.map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm text-text-secondary mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {numberFields.length > 0 && (
                <div className="bg-bg-card rounded-xl border border-border p-5 shadow-xs">
                  <h3 className="text-sm font-semibold text-text-primary mb-4">Numeric Settings</h3>
                  <div className="space-y-4">
                    {numberFields.map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm text-text-secondary mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => handleChange(key, Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
