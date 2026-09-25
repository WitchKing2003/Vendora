import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ButtonCustom from '../../../../components/ButtonComponent/ButtonCustom';
import Icon, { type IconName } from '../../../../components/brand/Icon';
import { Kicker, Seal, SectionHeading, StitchRule } from '../../../../components/brand/Stitch';
import CategoryCard from '../../../../components/product/CategoryCard';
import { CATEGORY_DEFS } from '../../../../data/categoryData';
import { categoryGradient } from '../../../../data/categoryMeta';
import { useToastStore } from '../../../../stores/toastStore';

/** The four sections that best express what Vendora is for. */
const FEATURED_SLUGS = ['handmade', 'homeLiving', 'fashion', 'beauty'];

/**
 * Featured categories — the map of the market.
 *
 * Each tile carries its section's own colour and glyph, so the homepage
 * answers "what is sold here?" in one glance instead of one scroll.
 */
export const FeaturedCategories = () => {
  const { t } = useTranslation();
  const featured = FEATURED_SLUGS.map((slug) =>
    CATEGORY_DEFS.find((c) => c.slug === slug)
  ).filter((c): c is (typeof CATEGORY_DEFS)[number] => Boolean(c));

  return (
    <section className="border-y border-line bg-paper-2/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <SectionHeading
          id="home-categories"
          kicker={t('homeSections.categories.kicker', 'Bốn khu chợ chính')}
          title={t('homeSections.categories.title', 'Bắt đầu từ đâu cũng được')}
          description={t(
            'homeSections.categories.desc',
            'Mỗi khu có màu riêng, người bán riêng và những món đồ không nơi nào có.'
          )}
          action={
            <Link
              to="/categories"
              className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold-deep"
            >
              <Icon name="weave" className="h-3.5 w-3.5" />
              {t('nav.allCategories', 'Toàn bộ danh mục')}
              <Icon
                name="arrowRight"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          }
        />

        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * The promo band.
 *
 * A single, unmissable offer instead of a grid of competing banners: one
 * promise, one code, one button. The code copies itself and confirms with a
 * toast, because making someone memorise a voucher is a design failure.
 */
export const PromoBand = () => {
  const { t } = useTranslation();
  const pushToast = useToastStore((s) => s.push);
  const code = 'PHIENCHO30';

  const copyCode = () => {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    pushToast({
      tone: 'success',
      title: t('promo.copiedTitle', 'Đã sao chép mã giảm giá'),
      message: t('promo.copiedMessage', { code, defaultValue: 'Mã {{code}} sẵn sàng dùng ở bước thanh toán.' }),
      icon: 'copy',
    });
  };

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <span aria-hidden className="loom loom-light absolute inset-0" />
      <span
        aria-hidden
        className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rotate-45 border border-gold/20"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-10 lg:py-20">
        <div>
          <Kicker tone="light">{t('promo.kicker', 'Ưu đãi phiên chợ')}</Kicker>
          <h2 className="mt-4 max-w-xl font-display text-3xl leading-[1.1] tracking-[-0.02em] sm:text-[2.9rem]">
            {t('promo.title', 'Giảm 30% cho đơn từ 2 gian hàng')}
          </h2>
          <p className="mt-5 max-w-lg font-body text-sm leading-relaxed text-white/70 sm:text-base">
            {t(
              'promo.desc',
              'Gom đồ thủ công từ nhiều gian hàng trong cùng một đơn — chúng tôi gộp gói và gửi đi một lần, bạn tiết kiệm cả phí vận chuyển lẫn giá.'
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* The code, as a woven ticket you can tear off */}
            <ButtonCustom
              variant="raw"
              onClick={copyCode}
              className="group flex items-stretch border border-dashed border-gold-soft/80 bg-white/5 transition-colors hover:bg-white/10"
            >
              <span className="flex items-center px-4 py-3 font-body text-sm font-bold uppercase tracking-[0.22em] text-gold-soft">
                {code}
              </span>
              <span aria-hidden className="my-2 w-px border-l border-dashed border-gold-soft/50" />
              <span className="flex items-center gap-2 px-4 py-3 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white">
                <Icon name="copy" className="h-4 w-4" />
                {t('promo.copy', 'Sao chép')}
              </span>
            </ButtonCustom>

            <Link
              to="/sale"
              className="group inline-flex items-center gap-2.5 border border-white/25 px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:border-gold hover:bg-gold hover:text-ink"
            >
              {t('promo.cta', 'Xem hàng đang giảm')}
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 font-body text-xs text-white/55">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {t('promo.ends', 'Áp dụng đến hết 30/09 cho toàn bộ gian hàng.')}
          </p>
        </div>

        {/* Offer panel */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-3">
            <span
              className="loom loom-light relative col-span-2 aspect-[16/9] overflow-hidden"
              style={{ backgroundImage: categoryGradient('handmade') }}
            >
              <span className="absolute bottom-3 left-4 font-display text-xl text-white/90">
                {t('promo.panel1', 'Đồ thủ công')}
              </span>
            </span>
            <span
              className="loom loom-light relative aspect-square overflow-hidden"
              style={{ backgroundImage: categoryGradient('homeLiving') }}
            >
              <span className="absolute bottom-3 left-3 font-display text-base text-white/90">
                {t('promo.panel2', 'Nhà cửa')}
              </span>
            </span>
            <span
              className="loom loom-light relative aspect-square overflow-hidden"
              style={{ backgroundImage: categoryGradient('beauty') }}
            >
              <span className="absolute bottom-3 left-3 font-display text-base text-white/90">
                {t('promo.panel3', 'Làm đẹp')}
              </span>
            </span>
          </div>

          <span className="absolute -right-3 -top-5">
            <Seal tone="gold" rotate={8} className="px-4 py-3 font-display text-lg normal-case tracking-normal">
              −30%
            </Seal>
          </span>
        </div>
      </div>
    </section>
  );
};

const POINTS: { icon: IconName; key: string }[] = [
  { icon: 'thread', key: 'story.point1' },
  { icon: 'shield', key: 'story.point2' },
  { icon: 'truck', key: 'story.point3' },
];

/**
 * The brand story band — the "why" behind the market, kept to three concrete
 * promises so it reads as conviction rather than marketing.
 */
export const BrandStory = () => {
  const { t } = useTranslation();

  return (
    <section className="border-y border-line bg-paper-2/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Kicker>{t('story.kicker', 'Về Vendora')}</Kicker>
            <h2 className="mt-4 font-display text-3xl leading-[1.12] tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              {t('story.title', 'Một phiên chợ, không phải một cái kho.')}
            </h2>
            <p className="mt-5 font-body text-sm leading-relaxed text-ink/65">
              {t(
                'story.p1',
                'Vendora bắt đầu từ những xưởng nhỏ: một lò gốm ở Bát Tràng, một khung cửi ở Hà Đông, một mẻ cà phê rang tay. Chúng tôi gom họ lại thành một phiên chợ — nơi mỗi gian hàng vẫn giữ được tên, câu chuyện và giá của chính mình.'
              )}
            </p>
            <StitchRule className="my-6" />
            <p className="font-body text-sm leading-relaxed text-ink/65">
              {t(
                'story.p2',
                'Không có hàng loạt, không có ảnh chụp chung. Mỗi món đồ bạn mua ở đây đều đi ra từ một xưởng cụ thể, do một người cụ thể làm.'
              )}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.key} className="brand-frame relative border border-line bg-surface p-5">
                <span className="flex h-11 w-11 items-center justify-center bg-gold-mist text-gold-deep">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-lg leading-snug text-ink">
                  {t(`${p.key}.title`, { defaultValue: '' })}
                </p>
                <p className="mt-2 font-body text-[13px] leading-relaxed text-ink/60">
                  {t(`${p.key}.desc`, { defaultValue: '' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
