import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon, { type IconName } from '../../../../components/brand/Icon';
import useReducedMotion from '../../../../hooks/useReducedMotion';

const MESSAGES: { icon: IconName; key: string }[] = [
  { icon: 'truck', key: 'announce.shipping' },
  { icon: 'thread', key: 'announce.handmade' },
  { icon: 'shield', key: 'announce.protection' },
  { icon: 'gift', key: 'announce.gift' },
];

const DISMISS_KEY = 'vendora-announce-dismissed';

/**
 * The strip above the sticky header, in normal page flow. It scrolls away
 * with the page instead of folding inside the sticky header — folding there
 * changed the header's height while scrolling and fought the browser's
 * scroll anchoring, producing an endless jitter loop near the fold
 * threshold. Keeping it static removes the layout shift entirely.
 */
const AnnouncementBar = () => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(DISMISS_KEY) === '1';
  });

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, '1');
  };

  /** One message, with the gold thread diamond between items. */
  const item = (m: { icon: IconName; key: string }, i: number) => (
    <span key={`${m.key}-${i}`} className="inline-flex items-center gap-2.5">
      <Icon name={m.icon} className="h-3.5 w-3.5 text-gold-soft" />
      <span className="font-body text-[11px] font-medium uppercase tracking-[0.16em] text-white/85">
        {t(m.key)}
      </span>
      <span aria-hidden className="ml-4 inline-block h-1.5 w-1.5 rotate-45 bg-gold/70" />
    </span>
  );

  return (
    <div className="overflow-hidden bg-ink">
      <div className="mx-auto flex max-w-[110rem] items-center">
        <div className="mask-fade-x flex min-w-0 flex-1 overflow-hidden">
          {reducedMotion ? (
            <div className="flex items-center gap-6 whitespace-nowrap px-4 py-2.5">
              {MESSAGES.slice(0, 2).map(item)}
            </div>
          ) : (
            <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap py-2.5 pl-4 hover:[animation-play-state:paused]">
              {[0, 1].map((copy) =>
                MESSAGES.map((m, i) => (
                  <span key={`${copy}-${m.key}`} className="flex items-center">
                    {item(m, i)}
                  </span>
                ))
              )}
            </div>
          )}
        </div>

        <ButtonCustom
          variant="raw"
          ariaLabel={t('announce.dismiss', 'Ẩn thông báo')}
          onClick={dismiss}
          className="shrink-0 px-3 py-2 text-white/45 transition-colors hover:text-white"
        >
          <Icon name="close" className="h-3.5 w-3.5" />
        </ButtonCustom>
      </div>
    </div>
  );
};

export default AnnouncementBar;
