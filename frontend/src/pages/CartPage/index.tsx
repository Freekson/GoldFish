import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../components/Layout";

const CartPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <Breadcrumbs items={["Main"]} pathes={["/"]} last="Cart" to="/cart" />
      <h3>Cart</h3>
    </Layout>
  );
};

export default CartPage;
