import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  flip,
  offset,
  shift,
} from '@floating-ui/react';
import { CheckCircle2, ChevronDown, Loader2, ShieldCheck } from 'lucide-react';
import { getCaptchaChallenge } from '../../services/captchaService';

const CaptchaPopover = forwardRef(function CaptchaPopover(
  { value, onChange, error, disabled = false },
  ref,
) {
  const [open, setOpen] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const widgetRef = useRef(null);

  const fetchCaptcha = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    onChange('');
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

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const el = widgetRef.current;
    if (!el || !challenge) return;

    el.setAttribute('challenge', JSON.stringify(challenge));
    el.setAttribute('auto', 'off');
    el.hideFooter = true;
    el.hideLogo = true;

    const handleStateChange = (ev) => {
      if (ev.detail?.payload) {
        onChangeRef.current(ev.detail.payload);
        setOpen(false);
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

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const verified = Boolean(value);
  const triggerLabel = verified ? 'Verified' : 'Verify you\'re human';

  return (
    <div>
      <button
        ref={refs.setReference}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm bg-bg-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${
          verified
            ? 'border-success-500 text-success-700'
            : 'border-border text-text-primary hover:border-primary-500'
        }`}
        {...getReferenceProps()}
      >
        <span className="flex items-center gap-2">
          {open && !verified ? (
            <Loader2 size={16} className="animate-spin" />
          ) : verified ? (
            <CheckCircle2 size={16} />
          ) : (
            <ShieldCheck size={16} />
          )}
          {triggerLabel}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {error && (
        <p className="mt-1.5 text-xs text-danger-600">{error}</p>
      )}

      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="z-50 mt-2 rounded-xl border border-border bg-bg-card shadow-lg p-3 min-w-[280px]"
          {...getFloatingProps()}
        >
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
              hideFooter
              hideLogo
            />
          )}
          <button
            type="button"
            onClick={fetchCaptcha}
            disabled={loading}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-60"
          >
            Get a new challenge
          </button>
        </div>
      )}
    </div>
  );
});

export default CaptchaPopover;