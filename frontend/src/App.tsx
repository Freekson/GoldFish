import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import AboutUsPage from "./pages/AboutUsPage";
import OrdersListPage from "./pages/OrdersListPage";
import OrderTrackPage from "./pages/OrderTrackPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import WishlistPage from "./pages/WishlistPage";
import SettingPage from "./pages/SettingsPage";
import ContactPage from "./pages/ContactPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ChangeProfileDataPage from "./pages/ChangeProfileDataPage";
import ChangeImagePage from "./pages/ChangeImagePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/product/:id" element={<ProductPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/about-us" element={<AboutUsPage />}></Route>
        <Route path="/catalog" element={<CatalogPage />}></Route>
        <Route path="/profile/orders/:id" element={<OrderTrackPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <OrdersListPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile/settings/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile/settings/change-profile-data"
          element={
            <ProtectedRoute>
              <ChangeProfileDataPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile/settings/change-image"
          element={
            <ProtectedRoute>
              <ChangeImagePage />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
