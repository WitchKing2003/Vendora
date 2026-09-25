import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from '../../../components/brand/Icon';
import { Kicker, StitchRule } from '../../../components/brand/Stitch';
import CategoryCard from '../../../components/product/CategoryCard';
import ProductRail from '../../../components/product/ProductRail';
import { CATEGORY_DEFS } from '../../../data/categoryData';
import { ON_SALE, NEW_ARRIVALS } from '../../../data/catalogue';
import { useHistoryStore } from '../../../stores/historyStore';

const COLLECTIONS = [
  {
    to: '/new',
    key: 'discover.collections.new',
    icon: 'sparkles' as const,
    tone: 'from-gold to-gold-deep',
  },
  {
    to: '/sale',
    key: 'discover.collections.sale',
    icon: 'tag' as const,
    tone: 'from-lacquer to-lacquer-deep',
  },
  {
    to: '/category/handmade',
    key: 'discover.collections.handmade',
    icon: 'thread' as const,
    tone: 'from-teal to-teal-deep',
  },
  {
    to: '/category/homeLiving/decor',
    key: 'discover.collections.decor',
    icon: 'home' as const,
    tone: 'from-indigo-ink to-[#26394B]',
  },
];

/**
 * The whole market, on one page.
 *
 * This is the answer to "what does this site sell?" in a single screen: eight
 * sections, each with its own colour and glyph, plus four curated collections
 * for people who came with no specific plan.
 */
const CategoryIndexPage = () => {
  const { t } = useTranslation();
  const viewed = useHistoryStore((s) => s.viewed);

  return (
    <div className="bg-paper">
      {/* Header */}
      <div className="border-b border-line bg-paper-2/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <Kicker>{t('categories.kicker', 'Toàn bộ phiên chợ')}</Kicker>
          <h1 className="mt-3 max-w-3xl font-display text-3xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
            {t('categories.title', 'Tám gian hàng, một phiên chợ')}
          </h1>
          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-ink/65 sm:text-base">
            {t(
              'categories.desc',
              'Mỗi nhóm hàng là một khu chợ nhỏ với màu sắc và biểu tượng riêng — chọn một khu để bắt đầu dạo.'
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_DEFS.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>

        {/* Collections */}
        <div className="mt-14">
          <StitchRule className="mb-8" />
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            {t('discover.collections.title', 'Bộ sưu tập được chọn')}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className={`group relative flex items-center gap-4 overflow-hidden bg-gradient-to-br ${c.tone} px-5 py-5 text-white transition-transform duration-500 ease-[var(--ease-brand)] hover:-translate-y-1`}
              >
                <span aria-hidden className="loom loom-light absolute inset-0" />
                <Icon
                  name={c.icon}
                  className="relative h-7 w-7 shrink-0 text-white/85 transition-transform duration-500 group-hover:scale-110"
                />
                <span className="relative font-body text-sm font-semibold leading-snug">
                  {t(c.key)}
                </span>
                <Icon
                  name="arrowRight"
                  className="relative ml-auto h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ProductRail
        id="categories-new"
        kicker={t('discover.new.kicker', 'Vừa cập bến')}
        title={t('discover.new.title', 'Hàng mới về chợ')}
        viewAllTo="/new"
        viewAllLabel={t('nav.new', 'Hàng mới')}
        products={NEW_ARRIVALS.slice(0, 4)}
      />

      {viewed.length > 0 && (
        <ProductRail
          id="categories-viewed"
          kicker={t('personal.viewed.kicker', 'Bạn đã xem')}
          title={t('personal.viewed.title', 'Xem tiếp gần đây')}
          products={viewed.slice(0, 4)}
        />
      )}

      <ProductRail
        id="categories-sale"
        kicker={t('discover.sale.kicker', 'Đang giảm')}
        title={t('discover.sale.title', 'Gian hàng đang xả kho')}
        viewAllTo="/sale"
        viewAllLabel={t('nav.sale', 'Khuyến mãi')}
        products={ON_SALE.slice(0, 4)}
      />
    </div>
  );
};

export default CategoryIndexPage;
