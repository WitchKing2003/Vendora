import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonCustom from "../../../../components/ButtonComponent/ButtonCustom";
import TextCustom from "../../../../components/TextComponent/TextCustom";

const INTERVAL_MS = 30_000;

interface Tile {
  captionKey: string;
  gradient: string;
}

interface Slide {
  key: string; // "s1" | "s2" | "s3"
  tiles: [Tile, Tile, Tile]; // big left, top-right, bottom-right
}

const GRADIENTS = {
  gold: "linear-gradient(170deg, #D9A23B 0%, #A8721F 100%)",
  teal: "linear-gradient(170deg, #2C4A43 0%, #16302B 100%)",
  rust: "linear-gradient(170deg, #8B3A2B 0%, #5E241A 100%)",
  brown: "linear-gradient(170deg, #5B4636 0%, #3A2C20 100%)",
  blue: "linear-gradient(170deg, #3E5C76 0%, #26394B 100%)",
};

const SLIDES: Slide[] = [
  {
    key: "s1",
    tiles: [
      { captionKey: "highlight.s1.tile1", gradient: GRADIENTS.gold },
      { captionKey: "highlight.s1.tile2", gradient: GRADIENTS.teal },
      { captionKey: "highlight.s1.tile3", gradient: GRADIENTS.rust },
    ],
  },
  {
    key: "s2",
    tiles: [
      { captionKey: "highlight.s2.tile1", gradient: GRADIENTS.brown },
      { captionKey: "highlight.s2.tile2", gradient: GRADIENTS.blue },
      { captionKey: "highlight.s2.tile3", gradient: GRADIENTS.gold },
    ],
  },
  {
    key: "s3",
    tiles: [
      { captionKey: "highlight.s3.tile1", gradient: GRADIENTS.teal },
      { captionKey: "highlight.s3.tile2", gradient: GRADIENTS.rust },
      { captionKey: "highlight.s3.tile3", gradient: GRADIENTS.brown },
    ],
  },
];

const HighlightTile = ({ tile, big, t }: { tile: Tile; big?: boolean; t: (key: string) => string }) => (
  <div
    className={`relative overflow-hidden transition-transform duration-300 hover:scale-[1.01] ${
      big ? "row-span-2" : ""
    }`}
    style={{ backgroundImage: tile.gradient }}
  >
    <TextCustom
      as="span"
      variant="body-sm"
      color="!text-white"
      className={`absolute bottom-4 left-5 z-10 font-medium drop-shadow-sm ${
        big ? "text-base sm:text-lg" : "text-sm"
      }`}
    >
      {t(tile.captionKey)}
    </TextCustom>
  </div>
);

const ArrowButton = ({
  dir,
  onClick,
  label,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  label: string;
}) => (
  <ButtonCustom
    variant="raw"
    ariaLabel={label}
    onClick={onClick}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition-colors hover:bg-ink hover:text-white"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      {dir === "prev" ? (
        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  </ButtonCustom>
);

const HighlightSlider = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [index, paused]);

  // Manual navigation restarts the 30s timer because `index` is a deps above.
  const goTo = (i: number) =>
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) goTo(delta < 0 ? index + 1 : index - 1);
    touchStartX.current = null;
  };

  const slide = SLIDES[index];

  return (
    <section
      className="bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div
          key={slide.key}
          className="highlight-slide-enter grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Text side */}
          <div>
            <TextCustom as="p" variant="body-sm" color="!text-gold-deep" className="font-bold">
              {t(`highlight.${slide.key}.kicker`)}
            </TextCustom>
            <TextCustom as="h2" variant="h1" className="mt-4 lg:text-6xl">
              {t(`highlight.${slide.key}.titleLine1`)}
              <br />
              {t(`highlight.${slide.key}.titlePrefix`)}
              <em className="italic text-teal">
                {t(`highlight.${slide.key}.titleItalic`)}
              </em>
              {t(`highlight.${slide.key}.titleSuffix`)}
            </TextCustom>
            <TextCustom
              as="p"
              variant="body"
              color="!text-ink/70"
              className="mt-6 max-w-xl sm:text-lg"
            >
              {t(`highlight.${slide.key}.desc`)}
            </TextCustom>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ButtonCustom
                variant="primary"
                size="lg"
                className="px-6 hover:bg-teal"
              >
                {t(`highlight.${slide.key}.ctaPrimary`)}
              </ButtonCustom>
              <ButtonCustom
                variant="raw"
                className="text-sm font-semibold text-ink underline decoration-line underline-offset-8 transition-colors hover:text-gold-deep"
              >
                {t(`highlight.${slide.key}.ctaSecondary`)}
              </ButtonCustom>
            </div>

            {/* Controls: dots (left) + prev/next arrows (right) */}
            <div className="mt-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {SLIDES.map((s, i) => (
                  <ButtonCustom
                    key={s.key}
                    variant="raw"
                    ariaLabel={t("highlight.goTo", { index: i + 1 })}
                    aria-current={i === index}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-8 bg-gold"
                        : "w-2 bg-line hover:bg-gold-deep"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <ArrowButton
                  dir="prev"
                  onClick={() => goTo(index - 1)}
                  label={t("highlight.prev")}
                />
                <ArrowButton
                  dir="next"
                  onClick={() => goTo(index + 1)}
                  label={t("highlight.next")}
                />
              </div>
            </div>
          </div>

          {/* Collage side: 1 big tile + 2 stacked */}
          <div className="grid h-[340px] grid-cols-[1.4fr_1fr] grid-rows-2 gap-3 sm:h-[440px] lg:h-[520px] lg:gap-4">
            <HighlightTile tile={slide.tiles[0]} big t={t} />
            <HighlightTile tile={slide.tiles[1]} t={t} />
            <HighlightTile tile={slide.tiles[2]} t={t} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightSlider;
