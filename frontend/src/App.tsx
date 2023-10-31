import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import CartPage from "./pages/CartPage";
import ProductPage from "./pages/ProductPage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/product/:id" element={<ProductPage />}></Route>
        <Route path="/cart" element={<CartPage />}></Route>
        <Route path="/about-us" element={<AboutUsPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
