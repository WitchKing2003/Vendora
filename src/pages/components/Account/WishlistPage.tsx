import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ButtonCustom from '../../../components/ButtonComponent/ButtonCustom';
import Icon from '../../../components/brand/Icon';
import { Kicker } from '../../../components/brand/Stitch';
import { EmptyState } from '../../../components/feedback/States';
import ProductCard from '../../../components/product/ProductCard';
import ProductRail from '../../../components/product/ProductRail';
import { recommendFrom } from '../../../data/catalogue';
import { useToastStore } from '../../../stores/toastStore';
import { useWishlistStore } from '../../../stores/wishlistStore';
import { toSnapshot } from '../../../types/product';

/**
 * The wishlist.
 *
 * Two jobs: show saved products with the authority of the full product card
 * (so they can be added straight from here), and — when empty — never leave
 * the shopper staring at nothing.
 */
const WishlistPage = () => {
  const { t } = useTranslation();
  const items = useWishlistStore((s) => s.items);
  const clear = useWishlistStore((s) => s.clear);
  const pushToast = useToastStore((s) => s.push);

  const recommendations = useMemo(
    () => recommendFrom(items.map((i) => ({ id: i.id, categorySlug: i.categorySlug, price: i.price })), 4),
    [items]
  );

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body text-xs text-ink/50">
          <Link to="/" className="transition-colors hover:text-gold-deep">
            {t('listing.breadcrumbHome', 'Trang chủ')}
          </Link>
          <span aria-hidden className="h-1 w-1 rotate-45 bg-gold/60" />
          <span className="text-ink/70">{t('account.wishlist', 'Sản phẩm yêu thích')}</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Kicker>{t('personal.wishlist.kicker', 'Bộ sưu tập của bạn')}</Kicker>
            <h1 className="mt-3 font-display text-3xl leading-tight tracking-[-0.02em] text-ink sm:text-4xl">
              {t('account.wishlist', 'Sản phẩm yêu thích')}
            </h1>
            <p className="mt-2.5 font-body text-sm text-ink/60">
              {t('personal.wishlist.count', {
                count: items.length,
                defaultValue: '{{count}} sản phẩm đang chờ bạn quay lại.',
              })}
            </p>
          </div>

          {items.length > 0 && (
            <ButtonCustom
              variant="raw"
              onClick={() => {
                clear();
                pushToast({
                  tone: 'info',
                  title: t('personal.wishlist.cleared', 'Đã xoá danh sách yêu thích'),
                  icon: 'heart',
                });
              }}
              className="inline-flex items-center gap-2 border border-line px-3.5 py-2 font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink/60 transition-colors hover:border-lacquer hover:text-lacquer"
            >
              <Icon name="trash" className="h-3.5 w-3.5" />
              {t('personal.wishlist.clear', 'Xoá tất cả')}
            </ButtonCustom>
          )}
        </div>

        <div className="stitch-rule my-7" />

        {items.length === 0 ? (
          <div className="border border-line bg-surface">
            <EmptyState
              icon="heart"
              title={t('personal.wishlist.emptyTitle', 'Chưa có gì trong bộ sưu tập')}
              message={t(
                'personal.wishlist.emptyMessage',
                'Chạm vào trái tim trên sản phẩm bạn thích — chúng sẽ được giữ ở đây, kể cả khi bạn rời đi.'
              )}
              action={
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-teal"
                >
                  <Icon name="stall" className="h-4 w-4" />
                  {t('personal.wishlist.startBrowsing', 'Bắt đầu dạo chợ')}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard key={item.id} product={toSnapshot(item)} />
            ))}
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <ProductRail
          id="wishlist-recommended"
          kicker={t('personal.recommended.kicker', 'Dành cho bạn')}
          title={t('personal.recommended.title', 'Có thể bạn cũng thích')}
          description={t(
            'personal.recommended.desc',
            'Dựa trên những sản phẩm bạn đã lưu và đã xem.'
          )}
          products={recommendations}
        />
      )}
    </div>
  );
};

export default WishlistPage;
