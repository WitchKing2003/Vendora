import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/layouts/MainLayout";
import HomePage from "../pages/components/Home/HomePage";
import CategoryPage from "../pages/components/Listing/CategoryPage";
import ProductDetailPage from "../pages/components/Listing/ProductDetailPage";
import CartPage from "../pages/components/Cart/CartPage";
import CheckoutPage from "../pages/components/Cart/CheckoutPage";
import SuccessPage from "../pages/components/Cart/SuccessPage";
import MyOrdersPage from "../pages/components/Account/MyOrdersPage";
import OrderTrackingPage from "../pages/components/Account/OrderTrackingPage";
import AuthPage from "../pages/components/Account/AuthPage";
import AccountPage from "../pages/components/Account/AccountPage";
import WishlistPage from "../pages/components/Account/WishlistPage";
import ShopPage from "../pages/components/Shop/ShopPage";
import OpenShopPage from "../pages/components/Shop/OpenShopPage";
import DiscoverPage from "../pages/components/Discover/DiscoverPage";
import CategoryIndexPage from "../pages/components/Discover/CategoryIndexPage";
import AdminLayout from "../pages/components/Admin/AdminLayout";
import AdminCategoriesPage from "../pages/components/Admin/AdminCategoriesPage";
import AdminProductsPage from "../pages/components/Admin/AdminProductsPage";
import AdminUsersPage from "../pages/components/Admin/AdminUsersPage";
import AdminSellerApplicationsPage from "../pages/components/Admin/AdminSellerApplicationsPage";
import AdminDashboardPage from "../pages/components/Admin/AdminDashboardPage";
import AdminNotificationsPage from "../pages/components/Admin/AdminNotificationsPage";
import AdminSlidersPage from "../pages/components/Admin/AdminSlidersPage";
import AdminHomepageSectionsPage from "../pages/components/Admin/AdminHomepageSectionsPage";
import AdminAnalyticsPage from "../pages/components/Admin/AdminAnalyticsPage";
import AdminSettingsPage from "../pages/components/Admin/AdminSettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Discovery — one page, four collections */}
        <Route path="/shop" element={<DiscoverPage mode="all" />} />
        <Route path="/new" element={<DiscoverPage mode="new" />} />
        <Route path="/sale" element={<DiscoverPage mode="sale" />} />
        <Route path="/search" element={<DiscoverPage mode="search" />} />
        <Route path="/categories" element={<CategoryIndexPage />} />

        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/category/:category/:sub" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<SuccessPage />} />

        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/orders" element={<MyOrdersPage />} />
        <Route path="/account/orders/:code" element={<OrderTrackingPage />} />

        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
        <Route path="/reset-password" element={<AuthPage mode="reset" />} />

        <Route path="/openshop" element={<OpenShopPage />} />
        <Route path="/shop/:seller" element={<ShopPage />} />
      </Route>

      {/* Admin dashboard runs in its own shell — no storefront header/footer. */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="sliders" element={<AdminSlidersPage />} />
        <Route path="sections" element={<AdminHomepageSectionsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="applications" element={<AdminSellerApplicationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
