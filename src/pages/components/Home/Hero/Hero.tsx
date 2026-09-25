import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../../components/brand/Icon';
import { Kicker, Seal } from '../../../../components/brand/Stitch';
import useReducedMotion from '../../../../hooks/useReducedMotion';

const AUTOPLAY_MS = 9_000;

interface Tile {
  captionKey: string;
  gradient: string;
}

interface Slide {
  key: string;
  tiles: [Tile, Tile, Tile];
}

const GRADIENTS = {
  gold: 'linear-gradient(165deg, #D9A23B 0%, #9C6B1F 100%)',
  teal: 'linear-gradient(165deg, #2C4A43 0%, #16302B 100%)',
  lacquer: 'linear-gradient(165deg, #8B3A2B 0%, #5E241A 100%)',
  brown: 'linear-gradient(165deg, #5B4636 0%, #3A2C20 100%)',
  indigo: 'linear-gradient(165deg, #3E5C76 0%, #26394B 100%)',
};

const SLIDES: Slide[] = [
  {
    key: 's1',
    tiles: [
      { captionKey: 'highlight.s1.tile1', gradient: GRADIENTS.gold },
      { captionKey: 'highlight.s1.tile2', gradient: GRADIENTS.teal },
      { captionKey: 'highlight.s1.tile3', gradient: GRADIENTS.lacquer },
    ],
  },
  {
    key: 's2',
    tiles: [
      { captionKey: 'highlight.s2.tile1', gradient: GRADIENTS.brown },
      { captionKey: 'highlight.s2.tile2', gradient: GRADIENTS.indigo },
      { captionKey: 'highlight.s2.tile3', gradient: GRADIENTS.gold },
    ],
  },
  {
    key: 's3',
    tiles: [
      { captionKey: 'highlight.s3.tile1', gradient: GRADIENTS.teal },
      { captionKey: 'highlight.s3.tile2', gradient: GRADIENTS.lacquer },
      { captionKey: 'highlight.s3.tile3', gradient: GRADIENTS.brown },
    ],
  },
];

const STATS = [
  { value: '4.200+', key: 'hero.stats.stalls' },
  { value: '152k', key: 'hero.stats.orders' },
  { value: '4,9/5', key: 'hero.stats.rating' },
];

/**
 * The hero.
 *
 * Everything above the fold is a single, quiet statement: what Vendora is, what
 * it sells and what to do next. The collage uses the brand's own loom language
 * instead of stock photography, so the identity lands before any product does.
 *
 * Entrance is staggered (kicker → headline → copy → CTAs → collage), rotates
 * on its own, pauses when the shopper engages, and never auto-advances for
 * someone who asked for reduced motion.
 */
const Hero = () => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [index, paused, reducedMotion]);

  const goTo = (i: number) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  const stagger = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('hero.label', 'Giới thiệu Vendora')}
      className="relative overflow-hidden border-b border-line bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) goTo(delta < 0 ? index + 1 : index - 1);
        touchStartX.current = null;
      }}
    >
      {/* Ambient woven texture behind the whole hero */}
      <span aria-hidden className="loom pointer-events-none absolute inset-0 opacity-70" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-32 top-8 h-96 w-96 rotate-45 border border-gold/15"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div key={slide.key} className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Copy */}
          <div>
            <div className="animate-rise" style={stagger(0)}>
              <Kicker>{t(`highlight.${slide.key}.kicker`)}</Kicker>
            </div>

            <h1
              className="animate-rise mt-5 font-display text-4xl leading-[1.06] tracking-[-0.025em] text-ink sm:text-5xl lg:text-[3.9rem]"
              style={stagger(70)}
            >
              {t(`highlight.${slide.key}.titleLine1`)}
              <br />
              {t(`highlight.${slide.key}.titlePrefix`)}
              <em className="italic text-gold-leaf">
                {t(`highlight.${slide.key}.titleItalic`)}
              </em>
              {t(`highlight.${slide.key}.titleSuffix`)}
            </h1>

            <p
              className="animate-rise mt-6 max-w-xl font-body text-sm leading-relaxed text-ink/70 sm:text-base"
              style={stagger(140)}
            >
              {t(`highlight.${slide.key}.desc`)}
            </p>

            <div
              className="animate-rise mt-8 flex flex-wrap items-center gap-3 sm:gap-5"
              style={stagger(210)}
            >
              <Link
                to="/categories"
                className="group inline-flex items-center gap-2.5 border border-ink bg-ink px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-teal"
              >
                {t(`highlight.${slide.key}.ctaPrimary`)}
                <Icon
                  name="arrowRight"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/openshop"
                className="group inline-flex items-center gap-2 font-body text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-gold-deep"
              >
                {t(`highlight.${slide.key}.ctaSecondary`)}
              </Link>
            </div>

            {/* Proof, not promises */}
            <dl
              className="animate-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6"
              style={stagger(280)}
            >
              {STATS.map((s) => (
                <div key={s.key}>
                  <dt className="font-body text-[11px] uppercase tracking-[0.16em] text-ink/45">
                    {t(s.key)}
                  </dt>
                  <dd className="nums font-display text-2xl text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>

            {/* Controls */}
            <div className="mt-9 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5" role="tablist" aria-label={t('hero.slides', 'Các trang giới thiệu')}>
                {SLIDES.map((s, i) => (
                  <ButtonCustom
                    key={s.key}
                    variant="raw"
                    role="tab"
                    aria-selected={i === index}
                    ariaLabel={t('highlight.goTo', { index: i + 1 })}
                    onClick={() => goTo(i)}
                    className={`h-2 transition-all duration-500 ease-[var(--ease-brand)] ${
                      i === index ? 'w-9 bg-gold' : 'w-2 bg-line-strong hover:bg-gold-deep'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {[
                  { dir: 'prev' as const, icon: 'chevronLeft' as const, label: t('highlight.prev', 'Trước') },
                  { dir: 'next' as const, icon: 'chevronRight' as const, label: t('highlight.next', 'Tiếp') },
                ].map((btn) => (
                  <ButtonCustom
                    key={btn.dir}
                    variant="raw"
                    ariaLabel={btn.label}
                    onClick={() => goTo(btn.dir === 'prev' ? index - 1 : index + 1)}
                    className="flex h-11 w-11 items-center justify-center border border-line bg-surface text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <Icon name={btn.icon} className="h-4 w-4" />
                  </ButtonCustom>
                ))}
              </div>
            </div>
          </div>

          {/* Collage */}
          <div className="animate-rise relative" style={stagger(160)}>
            <div className="brand-frame relative grid h-[330px] grid-cols-[1.35fr_1fr] grid-rows-2 gap-3 border border-line bg-surface p-3 sm:h-[430px] lg:h-[500px]">
              {slide.tiles.map((tile, i) => (
                <div
                  key={`${slide.key}-${i}`}
                  className={`group/tile relative overflow-hidden ${
                    i === 0 ? 'row-span-2' : ''
                  }`}
                  style={{ backgroundImage: tile.gradient }}
                >
                  <span aria-hidden className="loom loom-light absolute inset-0" />
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100"
                    style={{
                      background:
                        'radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,.28) 0%, rgba(255,255,255,0) 60%)',
                    }}
                  />
                  <p
                    className={`absolute inset-x-3 bottom-3 z-10 font-body font-medium text-white ${
                      i === 0 ? 'text-sm sm:text-base' : 'text-[11px] sm:text-xs'
                    }`}
                  >
                    {t(tile.captionKey)}
                  </p>
                  <span
                    aria-hidden
                    className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-white/45 transition-all duration-500 group-hover/tile:h-9 group-hover/tile:w-9 group-hover/tile:border-white/80"
                  />
                </div>
              ))}
            </div>

            {/* Wax seal, stamped over the collage corner */}
            <span className="absolute -left-3 -top-4 hidden sm:block">
              <Seal tone="lacquer" rotate={-9} className="px-3.5 py-2 text-xs shadow-lift">
                {t('hero.seal', 'Phiên chợ 2026')}
              </Seal>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
