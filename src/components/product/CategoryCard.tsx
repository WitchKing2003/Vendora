import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from '../brand/Icon';
import { Seal } from '../brand/Stitch';
import { PRODUCTS_BY_CATEGORY, type CategoryDef } from '../../data/categoryData';
import { CATEGORY_ICON, categoryGradient } from '../../data/categoryMeta';

/**
 * The category card.
 *
 * Not a stock photo tile: a woven gradient panel in the section's own
 * colour, the section's glyph blown up as a watermark, a wax seal with the
 * product count, and the first few groups inside — enough to know what is in
 * there before committing to a tap.
 */
const CategoryCard = ({
  category,
  size = 'default',
}: {
  category: CategoryDef;
  size?: 'default' | 'compact';
}) => {
  const { t } = useTranslation();
  const count = (PRODUCTS_BY_CATEGORY[category.slug] ?? []).length;
  const icon = CATEGORY_ICON[category.slug] ?? 'tag';
  const compact = size === 'compact';

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-line bg-surface transition-all duration-500 ease-[var(--ease-brand)] hover:border-ink/35 hover:shadow-lift"
    >
      <div
        className="brand-frame relative overflow-hidden"
        style={{
          backgroundImage: categoryGradient(category.slug),
          aspectRatio: compact ? '16 / 10' : '4 / 3',
        }}
      >
        <span aria-hidden className="loom loom-light absolute inset-0" />
        {/* Glyph watermark */}
        <Icon
          name={icon}
          strokeWidth={1.1}
          className={`absolute -bottom-5 -right-4 text-white/12 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-110 group-hover:-rotate-3 ${
            compact ? 'h-24 w-24' : 'h-32 w-32'
          }`}
        />
        <span className="absolute left-3.5 top-3.5">
          <Seal tone="ink" rotate={-5}>
            {t('categories.productCount', { count, defaultValue: '{{count}} sản phẩm' })}
          </Seal>
        </span>

        <h3
          className={`absolute bottom-3.5 left-4 right-4 font-display leading-tight text-white ${
            compact ? 'text-xl' : 'text-2xl sm:text-3xl'
          }`}
        >
          {t(category.labelKey)}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-body text-[13px] leading-relaxed text-ink/60">
          {t(`categories.intro.${category.slug}`, { defaultValue: '' })}
        </p>

        {!compact && (
          <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {category.subs.slice(0, 3).map((sub) => (
              <li
                key={sub.slug}
                className="flex items-center gap-1.5 font-body text-[11px] uppercase tracking-[0.08em] text-ink/50"
              >
                <span aria-hidden className="h-1 w-1 rotate-45 bg-gold/70" />
                {t(sub.labelKey)}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto flex items-center gap-1.5 pt-4 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-gold-deep">
          {t('categories.enter', 'Ghé gian hàng')}
          <Icon
            name="arrowRight"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
