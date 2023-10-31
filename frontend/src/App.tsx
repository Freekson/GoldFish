import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import AboutUsPage from "./pages/AboutUsPage";
import OrdersListPage from "./pages/OrdersListPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/product/:id" element={<ProductPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/about-us" element={<AboutUsPage />}></Route>
        <Route path="/profile/orders" element={<OrdersListPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
