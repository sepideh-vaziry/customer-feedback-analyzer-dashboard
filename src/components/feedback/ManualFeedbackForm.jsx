import { useState } from 'react';
import { Loader2, CheckCircle2, FileText } from 'lucide-react';
import { createFeedback } from '../../services/feedbackService';

const initialForm = {
  source: 'MANUAL',
  content: '',
  externalId: '',
  customerName: '',
  customerEmail: '',
  customerIdentifier: '',
  language: 'en',
};

export default function ManualFeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState('');

  function validate() {
    const nextErrors = {};
    if (!form.content.trim()) {
      nextErrors.content = 'Feedback content is required';
    }
    if (form.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      nextErrors.customerEmail = 'Please enter a valid email';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');
    setResult(null);

    try {
      const data = await createFeedback(form);
      setResult(data);
      setForm(initialForm);
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Failed to create feedback');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 size={28} className="text-success-500" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Feedback Created Successfully</h3>
            <p className="text-sm text-text-secondary">Your feedback has been submitted for analysis.</p>
          </div>
        </div>

        <div className="bg-bg-base rounded-xl border border-border p-5 space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary">Feedback ID</span>
            <span className="text-sm font-medium text-text-primary font-mono">{result.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-50 text-warning-700">
              {result.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-text-secondary">Created At</span>
            <span className="text-sm font-medium text-text-primary">
              {new Date(result.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => { setResult(null); setForm(initialForm); }}
          className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-lg space-y-5">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-1.5">
          Feedback Content <span className="text-danger-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={form.content}
          onChange={handleChange}
          placeholder="Enter customer feedback text..."
          className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none ${
            errors.content ? 'border-danger-300' : 'border-border'
          }`}
        />
        {errors.content && <p className="mt-1.5 text-xs text-danger-600">{errors.content}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="externalId" className="block text-sm font-medium text-text-primary mb-1.5">
            External ID
          </label>
          <input
            id="externalId"
            name="externalId"
            type="text"
            value={form.externalId}
            onChange={handleChange}
            placeholder="feedback-001"
            className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-text-primary mb-1.5">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="it">Italian</option>
            <option value="nl">Dutch</option>
            <option value="pl">Polish</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
            <option value="tr">Turkish</option>
            <option value="vi">Vietnamese</option>
            <option value="id">Indonesian</option>
            <option value="th">Thai</option>
            <option value="sv">Swedish</option>
            <option value="da">Danish</option>
            <option value="no">Norwegian</option>
            <option value="fi">Finnish</option>
            <option value="cs">Czech</option>
            <option value="el">Greek</option>
            <option value="he">Hebrew</option>
            <option value="hu">Hungarian</option>
            <option value="ro">Romanian</option>
            <option value="sk">Slovak</option>
            <option value="uk">Ukrainian</option>
            <option value="bg">Bulgarian</option>
            <option value="hr">Croatian</option>
            <option value="sr">Serbian</option>
            <option value="sl">Slovenian</option>
            <option value="lt">Lithuanian</option>
            <option value="lv">Latvian</option>
            <option value="et">Estonian</option>
            <option value="ms">Malay</option>
            <option value="tl">Tagalog</option>
            <option value="sw">Swahili</option>
            <option value="af">Afrikaans</option>
            <option value="sq">Albanian</option>
            <option value="am">Amharic</option>
            <option value="hy">Armenian</option>
            <option value="az">Azerbaijani</option>
            <option value="bn">Bengali</option>
            <option value="bs">Bosnian</option>
            <option value="ca">Catalan</option>
            <option value="ceb">Cebuano</option>
            <option value="co">Corsican</option>
            <option value="cy">Welsh</option>
            <option value="eo">Esperanto</option>
            <option value="eu">Basque</option>
            <option value="fa">Persian</option>
            <option value="ga">Irish</option>
            <option value="gd">Scottish Gaelic</option>
            <option value="gl">Galician</option>
            <option value="gu">Gujarati</option>
            <option value="ha">Hausa</option>
            <option value="haw">Hawaiian</option>
            <option value="hmn">Hmong</option>
            <option value="ht">Haitian Creole</option>
            <option value="is">Icelandic</option>
            <option value="ig">Igbo</option>
            <option value="jw">Javanese</option>
            <option value="ka">Georgian</option>
            <option value="kk">Kazakh</option>
            <option value="km">Khmer</option>
            <option value="kn">Kannada</option>
            <option value="ku">Kurdish</option>
            <option value="ky">Kyrgyz</option>
            <option value="la">Latin</option>
            <option value="lb">Luxembourgish</option>
            <option value="lo">Lao</option>
            <option value="mg">Malagasy</option>
            <option value="mi">Maori</option>
            <option value="mk">Macedonian</option>
            <option value="ml">Malayalam</option>
            <option value="mn">Mongolian</option>
            <option value="mr">Marathi</option>
            <option value="my">Myanmar</option>
            <option value="ne">Nepali</option>
            <option value="ny">Chichewa</option>
            <option value="or">Odia</option>
            <option value="pa">Punjabi</option>
            <option value="ps">Pashto</option>
            <option value="si">Sinhala</option>
            <option value="so">Somali</option>
            <option value="sq">Albanian</option>
            <option value="su">Sundanese</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="tg">Tajik</option>
            <option value="ur">Urdu</option>
            <option value="uz">Uzbek</option>
            <option value="xh">Xhosa</option>
            <option value="yi">Yiddish</option>
            <option value="yo">Yoruba</option>
            <option value="zu">Zulu</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-text-primary mb-1.5">
          Customer Name
        </label>
        <input
          id="customerName"
          name="customerName"
          type="text"
          value={form.customerName}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium text-text-primary mb-1.5">
          Customer Email
        </label>
        <input
          id="customerEmail"
          name="customerEmail"
          type="email"
          value={form.customerEmail}
          onChange={handleChange}
          placeholder="john@example.com"
          className={`w-full px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
            errors.customerEmail ? 'border-danger-300' : 'border-border'
          }`}
        />
        {errors.customerEmail && <p className="mt-1.5 text-xs text-danger-600">{errors.customerEmail}</p>}
      </div>

      <div>
        <label htmlFor="customerIdentifier" className="block text-sm font-medium text-text-primary mb-1.5">
          Customer Identifier
        </label>
        <input
          id="customerIdentifier"
          name="customerIdentifier"
          type="text"
          value={form.customerIdentifier}
          onChange={handleChange}
          placeholder="cus-123"
          className="w-full px-3 py-2.5 text-sm bg-bg-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      {apiError && (
        <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700">{apiError}</div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <FileText size={16} />
            Submit Feedback
          </>
        )}
      </button>
    </form>
  );
}
