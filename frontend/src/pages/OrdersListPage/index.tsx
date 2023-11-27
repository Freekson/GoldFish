import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import OrdersItem from "../../components/OrdersItem";
import styles from "./OrdersListPage.module.scss";
import { useEffect } from "react";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/order/slice";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { Status } from "../../types";
import Skeleton from "react-loading-skeleton";

const OrdersListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { userOrders, status } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders({ token: userData?.token ?? "" }));
  }, [dispatch, userData?.token]);

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
        {status === Status.ERROR ? (
          <MessageBox
            message="An error occurred while loading orders, we are working on it"
            type={MessageTypes.DANGER}
            customStyles={{ marginTop: "1rem" }}
          />
        ) : status === Status.LOADING ? (
          <Skeleton height={100} count={3} style={{ marginBlock: ".7rem" }} />
        ) : (
          userOrders &&
          userOrders.map((item) => (
            <OrdersItem
              key={item._id}
              status={item.status}
              id={item._id}
              date={item.date}
              totalPrice={item.totalPrice}
            />
          ))
        )}
      </section>
    </Layout>
  );
};

export default OrdersListPage;
