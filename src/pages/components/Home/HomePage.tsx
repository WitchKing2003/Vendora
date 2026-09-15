import HighlightSlider from "./HighlightSlider/HighlightSlider";
import ProductSection, { type Product } from "./Products/ProductSection";
import TrustBar from "./Products/TrustBar";

// TODO: replace with API data later
const NEW_PRODUCTS: Product[] = [
  {
    id: "new-1",
    seller: "Minh Studio",
    name: "Bình trà men rạn thủ công",
    price: 320_000,
    badge: "new",
    color: "#EAE4D4",
  },
  {
    id: "new-2",
    seller: "Lụa & Chi",
    name: "Áo dài lụa tơ tằm cách tân",
    price: 1_850_000,
    oldPrice: 2_200_000,
    badge: "sale",
    color: "#E6DEC9",
  },
  {
    id: "new-3",
    seller: "Vỏi Coffee",
    name: "Cà phê rang mộc 250g",
    price: 89_000,
    color: "#EAE4D4",
  },
  {
    id: "new-4",
    seller: "Rừng Xanh",
    name: "Thớt gỗ nghiền nguyên khối",
    price: 245_000,
    color: "#E4DCC7",
  },
];

const SALE_PRODUCTS: Product[] = [
  {
    id: "sale-1",
    seller: "Nhà Nến",
    name: "Nến đúc tay sáp ong",
    price: 120_000,
    oldPrice: 150_000,
    badge: "sale",
    color: "#E6DEC9",
  },
  {
    id: "sale-2",
    seller: "Gánh Hàng",
    name: "Túi vải in tay họa tiết chàm",
    price: 255_000,
    oldPrice: 300_000,
    badge: "sale",
    color: "#EAE4D4",
  },
  {
    id: "sale-3",
    seller: "Gốm Nhà",
    name: "Bộ 4 chén gốm men xanh",
    price: 480_000,
    oldPrice: 600_000,
    badge: "sale",
    color: "#E4DCC7",
  },
  {
    id: "sale-4",
    seller: "Lụa & Chi",
    name: "Khăn lụa nhuộm chàm",
    price: 390_000,
    oldPrice: 520_000,
    badge: "sale",
    color: "#E6DEC9",
  },
];

const HomePage = () => {
  return (
    <div className="">
      <HighlightSlider />
      <ProductSection
        titleKey="products.featuredTitle"
        viewAllKey="products.viewAll"
        products={NEW_PRODUCTS}
      />
      <ProductSection
        titleKey="products.saleTitle"
        viewAllKey="products.viewAll"
        products={SALE_PRODUCTS}
      />
      <TrustBar />
    </div>
  );
};

export default HomePage;
