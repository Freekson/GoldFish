import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true} options={{ clientId: "test" }}>
        <ScrollToTop>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ScrollToTop>
      </PayPalScriptProvider>
    </Provider>
  </Router>
);
