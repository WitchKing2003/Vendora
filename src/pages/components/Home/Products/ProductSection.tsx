import { useTranslation } from 'react-i18next';
import ProductRail from '../../../../components/product/ProductRail';
import type { SnapshotSource } from '../../../../types/product';

interface ProductSectionProps {
  /** i18n keys, so every consumer keeps its own copy. */
  kickerKey?: string;
  titleKey: string;
  viewAllKey: string;
  viewAllTo?: string;
  products: SnapshotSource[];
  id?: string;
}

/**
 * A homepage product section — now just the shared rail with i18n wired up,
 * so a product looks and behaves identically here, in a search result and in
 * the wishlist.
 */
const ProductSection = ({
  kickerKey,
  titleKey,
  viewAllKey,
  viewAllTo,
  products,
  id,
}: ProductSectionProps) => {
  const { t } = useTranslation();
  return (
    <ProductRail
      id={id ?? titleKey}
      kicker={kickerKey ? t(kickerKey) : undefined}
      title={t(titleKey)}
      products={products}
      viewAllTo={viewAllTo}
      viewAllLabel={t(viewAllKey)}
    />
  );
};

export default ProductSection;
