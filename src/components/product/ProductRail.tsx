import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../brand/Icon';
import { SectionHeading } from '../brand/Stitch';
import ProductCard from './ProductCard';
import { toSnapshot, type SnapshotSource } from '../../types/product';

/**
 * A rail of products.
 *
 * On phones and tablets it is a snap-scrolling shelf you can flick with a
 * thumb; from `lg` up the same products settle into a four-column grid. The
 * layout is designed per device rather than shrunk from the desktop one.
 */
const ProductRail = ({
  kicker,
  title,
  description,
  products,
  viewAllTo,
  viewAllLabel,
  id,
  children,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  products: SnapshotSource[];
  viewAllTo?: string;
  viewAllLabel?: string;
  id?: string;
  children?: ReactNode;
}) => {
  const { t } = useTranslation();
  if (products.length === 0 && !children) return null;

  return (
    <section aria-labelledby={id} className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <SectionHeading
          id={id}
          kicker={kicker}
          title={title}
          description={description}
          action={
            viewAllTo ? (
              <Link
                to={viewAllTo}
                className="group inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold-deep"
              >
                {viewAllLabel ?? t('products.viewAll', 'Xem tất cả')}
                <Icon
                  name="arrowRight"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ) : undefined
          }
        />

        {children}

        <div className="scrollbar-none mask-fade-x -mx-4 mt-8 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              density="compact"
              product={toSnapshot(p)}
              className="w-[62%] shrink-0 snap-start sm:w-[40%] lg:w-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRail;
