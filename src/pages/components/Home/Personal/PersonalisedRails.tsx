import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icon from '../../../../components/brand/Icon';
import { Kicker } from '../../../../components/brand/Stitch';
import ProductRail from '../../../../components/product/ProductRail';
import { recommendFrom } from '../../../../data/catalogue';
import { useAuthStore } from '../../../../stores/authStore';
import { useHistoryStore } from '../../../../stores/historyStore';
import { useWishlistStore } from '../../../../stores/wishlistStore';

/**
 * Personalisation, kept on the shopper's side of the line.
 *
 * Everything here is derived from what they did on this site — what they
 * looked at, saved and bought — and nothing else. It is always reversible
 * (the wishlist, the history) and it never blocks the page: if the shopper is
 * brand new, these rails simply do not exist.
 */
const PersonalisedRails = () => {
  const { t } = useTranslation();

  const user = useAuthStore((s) => s.user);
  const viewed = useHistoryStore((s) => s.viewed);
  const purchased = useHistoryStore((s) => s.purchased);
  const wishlist = useWishlistStore((s) => s.items);

  const seeds = useMemo(() => {
    const map = new Map<string, { id: string; categorySlug?: string; price?: number }>();
    for (const item of [...viewed, ...wishlist, ...purchased]) {
      map.set(item.id, {
        id: item.id,
        categorySlug: item.categorySlug,
        price: item.price,
      });
    }
    return [...map.values()];
  }, [viewed, wishlist, purchased]);

  const recommended = useMemo(() => recommendFrom(seeds, 4), [seeds]);
  const shouldGreet = Boolean(user) || viewed.length > 0;

  const hour = new Date().getHours();
  const timeOfDay =
    hour < 11 ? t('personal.morning', 'buổi sáng') : hour < 18 ? t('personal.afternoon', 'buổi chiều') : t('personal.evening', 'buổi tối');

  return (
    <>
      {shouldGreet && (
        <section className="border-y border-line bg-gold-mist/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-7 sm:px-6 lg:px-10">
            <div>
              <Kicker>{t('personal.kicker', 'Dành riêng cho bạn')}</Kicker>
              <p className="mt-2 font-display text-2xl leading-snug text-ink sm:text-3xl">
                {user
                  ? t('personal.greeting', {
                      name: user.name,
                      time: timeOfDay,
                      defaultValue: 'Chào {{time}}, {{name}}.',
                    })
                  : t('personal.greetingGuest', {
                      time: timeOfDay,
                      defaultValue: 'Chào {{time}} — phiên chợ vẫn đang mở.',
                    })}
              </p>
              <p className="mt-1.5 font-body text-sm text-ink/60">
                {t('personal.subtitle', {
                  count: viewed.length,
                  defaultValue: 'Bạn đã ghé {{count}} sản phẩm. Tiếp tục từ chỗ dừng nhé?',
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/wishlist"
                className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 font-body text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <Icon name="heart" className="h-4 w-4" />
                {t('personal.openWishlist', 'Bộ sưu tập')}
              </Link>
              <Link
                to="/account/orders"
                className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 font-body text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <Icon name="package" className="h-4 w-4" />
                {t('personal.openOrders', 'Đơn của tôi')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {viewed.length > 0 && (
        <ProductRail
          id="home-viewed"
          kicker={t('personal.viewed.kicker', 'Bạn đã xem')}
          title={t('personal.viewed.title', 'Xem tiếp gần đây')}
          description={t('personal.viewed.desc', 'Những món bạn vừa ghé qua, vẫn còn ở đây.')}
          products={viewed.slice(0, 8)}
        />
      )}

      {recommended.length > 0 && (
        <ProductRail
          id="home-recommended"
          kicker={t('personal.recommended.kicker', 'Dành cho bạn')}
          title={t('personal.recommended.title', 'Có thể bạn cũng thích')}
          description={t(
            'personal.recommended.desc',
            'Gợi ý dựa trên những gì bạn đã xem và đã lưu — không dựa trên quảng cáo.'
          )}
          products={recommended}
        />
      )}

      {purchased.length > 0 && (
        <ProductRail
          id="home-purchased"
          kicker={t('personal.purchased.kicker', 'Mua lại')}
          title={t('personal.purchased.title', 'Những món bạn đã mua')}
          description={t('personal.purchased.desc', 'Hết hàng rồi? Thêm lại vào giỏ chỉ một chạm.')}
          products={purchased}
        />
      )}
    </>
  );
};

export default PersonalisedRails;
