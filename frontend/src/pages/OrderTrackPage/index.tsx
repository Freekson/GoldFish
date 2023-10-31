import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./OrderTackPage.module.scss";
import OrderStatus from "../../components/OrderStatus";
import OrderProduct from "../../components/OrderProduct";

const OrderTrackPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Order: 123</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile", "Orders"]}
        pathes={["/", "/profile", "/profile/orders"]}
        last="123"
      />
      <h3>Order: 123</h3>
      <section className={styles["order__wrapper"]}>
        <div className={styles["order"]}>
          <div className={styles["order__items"]}>
            <OrderProduct />
            <OrderProduct />
            <OrderProduct />
          </div>
          <div className={styles["order__status"]}>
            <h4>Order Status</h4>
            <OrderStatus step={3} />
          </div>
        </div>
        <p className={styles["questions"]}>
          Still have questions? <a href="#contact">Contact us</a>
        </p>
      </section>
    </Layout>
  );
};

export default OrderTrackPage;
