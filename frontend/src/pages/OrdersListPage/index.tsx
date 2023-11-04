import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import OrdersItem from "../../components/OrdersItem";
import styles from "./OrdersListPage.module.scss";

const OrdersListPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Oders</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile"]}
        pathes={["/", "/profile"]}
        last="Orders"
      />
      <h3>Your Orders</h3>
      <section className={styles["orders"]}>
        <OrdersItem />
        <OrdersItem />
      </section>
    </Layout>
  );
};

export default OrdersListPage;
