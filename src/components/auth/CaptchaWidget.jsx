import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { getCaptchaChallenge } from '../../services/captchaService';

const CaptchaWidget = forwardRef(function CaptchaWidget(
  { value, onChange, error, disabled = false },
  ref,
) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const widgetRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const fetchCaptcha = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    onChangeRef.current('');
    try {
      const data = await getCaptchaChallenge();
      setChallenge(data);
    } catch (err) {
      setChallenge(null);
      setFetchError('Failed to load captcha. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({ reset: fetchCaptcha }), []);

  useEffect(() => {
    fetchCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = widgetRef.current;
    if (!el || !challenge) return;

    el.setAttribute('auto', 'off');
    el.setAttribute('configuration', JSON.stringify({ hideFooter: true, hideLogo: true }));
    el.setAttribute('challenge', JSON.stringify(challenge));

    const handleStateChange = (ev) => {
      if (ev.detail?.payload) {
        onChangeRef.current(ev.detail.payload);
      }
    };
    const handleExpired = () => {
      onChangeRef.current('');
    };

    el.addEventListener('statechange', handleStateChange);
    el.addEventListener('expired', handleExpired);
    return () => {
      el.removeEventListener('statechange', handleStateChange);
      el.removeEventListener('expired', handleExpired);
    };
  }, [challenge]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-text-primary">
        <ShieldCheck size={16} />
        <span>Security verification</span>
      </div>

      {fetchError ? (
        <div className="p-3 rounded-lg bg-danger-50 text-sm text-danger-700">
          {fetchError}
        </div>
      ) : loading || !challenge ? (
        <div className="p-3 text-sm text-text-secondary flex items-center gap-2">
          <Loader2 size={14} className="animate-spin" />
          Loading challenge…
        </div>
      ) : (
        <altcha-widget
          ref={widgetRef}
        />
      )}

      <button
        type="button"
        onClick={fetchCaptcha}
        disabled={loading || disabled}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-60"
      >
        Get a new challenge
      </button>

      {error && (
        <p className="text-xs text-danger-600">{error}</p>
      )}
    </div>
  );
});

export default CaptchaWidget;