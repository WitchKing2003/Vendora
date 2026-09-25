import { useTranslation } from 'react-i18next';
import Hero from './Hero/Hero';
import ProductRail from '../../../components/product/ProductRail';
import TrustBar from './Products/TrustBar';
import { BrandStory, FeaturedCategories, PromoBand } from './Sections/Sections';
import PersonalisedRails from './Personal/PersonalisedRails';
import { NEW_ARRIVALS, ON_SALE } from '../../../data/catalogue';

/**
 * The homepage, in the order a shopper's questions arrive:
 *
 *   1. What is this? (hero)
 *   2. What do they sell? (featured categories)
 *   3. What is new? (new arrivals)
 *   4. Why should I trust the price? (promo band)
 *   5. What is on offer? (sale rail)
 *   6. Do they remember me? (personalised rails)
 *   7. Who is behind this? (brand story)
 *   8. Is it safe to buy? (trust bar)
 */
const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-paper">
      <Hero />

      <FeaturedCategories />

      <ProductRail
        id="home-new"
        kicker={t('products.newKicker', 'Vừa lên kệ hôm nay')}
        title={t('products.featuredTitle', 'Hàng mới về chợ')}
        description={t(
          'products.featuredDesc',
          'Những món vừa được các xưởng nhỏ hoàn thiện và đưa lên gian hàng.'
        )}
        viewAllTo="/new"
        viewAllLabel={t('nav.new', 'Hàng mới')}
        products={NEW_ARRIVALS.slice(0, 8)}
      />

      <PromoBand />

      <ProductRail
        id="home-sale"
        kicker={t('products.saleKicker', 'Gian hàng xả kho')}
        title={t('products.saleTitle', 'Đang giảm giá')}
        description={t(
          'products.saleDesc',
          'Giá đã hạ trực tiếp từ nhà bán — số lượng thường không còn nhiều.'
        )}
        viewAllTo="/sale"
        viewAllLabel={t('nav.sale', 'Khuyến mãi')}
        products={ON_SALE.slice(0, 8)}
      />

      <PersonalisedRails />

      <BrandStory />

      <TrustBar />
    </div>
  );
};

export default HomePage;
