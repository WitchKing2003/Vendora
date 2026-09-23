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
import ShopPage from "../pages/components/Shop/ShopPage";
import AdminLayout from "../pages/components/Admin/AdminLayout";
import AdminCategoriesPage from "../pages/components/Admin/AdminCategoriesPage";
import AdminProductsPage from "../pages/components/Admin/AdminProductsPage";
import AdminUsersPage from "../pages/components/Admin/AdminUsersPage";
import AdminSellerApplicationsPage from "../pages/components/Admin/AdminSellerApplicationsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/category/:category/:sub" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<SuccessPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/orders" element={<MyOrdersPage />} />
        <Route path="/account/orders/:code" element={<OrderTrackingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
        <Route path="/reset-password" element={<AuthPage mode="reset" />} />
        <Route path="/shop/:seller" element={<ShopPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminCategoriesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="applications" element={<AdminSellerApplicationsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
