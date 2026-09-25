import type { ListingProduct } from '../../../data/categoryData';
import ProductCard from '../../../components/product/ProductCard';

/**
 * Thin adapter: the listing grid used to own its own card. It now delegates to
 * the single branded <ProductCard /> so a product looks identical wherever it
 * appears — grid, rail, quick look or related.
 */
const ListingCard = ({
  product,
  variant = 'grid',
}: {
  product: ListingProduct;
  variant?: 'grid' | 'list';
}) => (
  <ProductCard
    product={{
      id: product.id,
      name: product.name,
      seller: product.seller,
      price: product.price,
      oldPrice: product.oldPrice,
      color: product.color,
      colorHex: product.colorHex,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      subSlug: product.subSlug,
      inStock: product.inStock,
    }}
    layout={variant}
  />
);

export default ListingCard;
