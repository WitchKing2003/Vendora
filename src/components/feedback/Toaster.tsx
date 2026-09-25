import { useTranslation } from 'react-i18next';
import ButtonCustom from '../ButtonComponent/ButtonCustom';
import Icon, { type IconName } from '../brand/Icon';
import { useToastStore, type ToastTone } from '../../stores/toastStore';

/**
 * SIGNATURE INTERACTION #2 — the notice board.
 *
 * Toasts are pinned like small paper notices: a stitched gold edge, a woven
 * colour swatch of the product just acted on, and a single direct action.
 * They stack bottom-right on desktop and sit above the mobile bottom nav.
 */

const TONE: Record<ToastTone, { icon: IconName; ring: string; tint: string }> = {
  success: { icon: 'checkCircle', ring: 'border-gold', tint: 'text-gold-deep' },
  info: { icon: 'info', ring: 'border-teal', tint: 'text-teal' },
  warn: { icon: 'alert', ring: 'border-warning', tint: 'text-warning' },
  error: { icon: 'alert', ring: 'border-danger', tint: 'text-danger' },
};

const Toaster = () => {
  const { t } = useTranslation();
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-label={t('feedback.notifications', 'Thông báo')}
      className="pointer-events-none fixed inset-x-3 bottom-20 z-[100] flex flex-col-reverse gap-2.5 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[372px]"
    >
      {toasts.map((toast) => {
        const tone = TONE[toast.tone];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto animate-toast-in overflow-hidden border border-line bg-surface shadow-lift"
          >
            {/* Stitched gold edge — the brand's signature on every notice */}
            <div className="flex">
              <span aria-hidden className={`w-[3px] shrink-0 bg-current ${tone.tint}`} />
              <div className="flex min-w-0 flex-1 items-start gap-3 px-3.5 py-3">
                {/* Woven swatch thumbnail, or the tone icon */}
                {toast.swatch ? (
                  <span
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-line"
                    style={{ backgroundColor: toast.swatch }}
                  >
                    <span aria-hidden className="loom loom-strong absolute inset-0" />
                    <span className="relative font-display text-lg text-ink/60">
                      {toast.swatchLabel}
                    </span>
                  </span>
                ) : (
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center border bg-paper ${tone.ring} ${tone.tint}`}
                  >
                    <Icon name={toast.icon ?? tone.icon} className="h-4.5 w-4.5" />
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-bold text-ink">{toast.title}</p>
                  {toast.message && (
                    <p className="mt-0.5 line-clamp-2 font-body text-xs leading-relaxed text-ink/60">
                      {toast.message}
                    </p>
                  )}
                  {toast.action && (
                    <ButtonCustom
                      variant="raw"
                      onClick={() => {
                        toast.action?.onClick();
                        dismiss(toast.id);
                      }}
                      className="mt-2 border-b border-gold pb-0.5 font-body text-xs font-bold uppercase tracking-[0.12em] text-gold-deep transition-colors hover:text-ink"
                    >
                      {toast.action.label}
                    </ButtonCustom>
                  )}
                </div>

                <ButtonCustom
                  variant="raw"
                  ariaLabel={t('feedback.dismiss', 'Đóng thông báo')}
                  onClick={() => dismiss(toast.id)}
                  className="-mr-1 -mt-1 shrink-0 p-1.5 text-ink/35 transition-colors hover:text-ink"
                >
                  <Icon name="close" className="h-4 w-4" />
                </ButtonCustom>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
