import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./OrderTackPage.module.scss";
import OrderStatus from "../../components/OrderStatus";
import OrderProduct from "../../components/OrderProduct";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchOrder } from "../../redux/order/slice";
import { useParams } from "react-router-dom";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { Status } from "../../types";
import Skeleton from "react-loading-skeleton";

const OrderTrackPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { userOrder, status } = useSelector((state: RootState) => state.order);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchOrder({ token: userData?.token ?? "", id: id ?? "" }));
  }, [dispatch, id, userData?.token]);
  return (
    <Layout>
      <Helmet>
        <title>Order: {id}</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile", "Orders"]}
        pathes={["/", "/profile", "/profile/orders"]}
        last={id ?? ""}
      />
      <h3>Order ID: {id}</h3>
      <section className={styles["order__wrapper"]}>
        <div className={styles["order"]}>
          <div className={styles["order__items"]}>
            <h4>Order Items</h4>
            {status === Status.ERROR ? (
              <MessageBox
                message="An error occurred while loading order items, we are working on it"
                type={MessageTypes.DANGER}
                customStyles={{ marginTop: "1rem" }}
              />
            ) : status === Status.LOADING ? (
              <Skeleton
                height={100}
                count={3}
                style={{ marginBlock: ".7rem" }}
              />
            ) : (
              (userOrder?.orderItems ?? []).map((item) => (
                <OrderProduct
                  key={item._id}
                  price={Number(
                    (
                      item.price -
                      (item.price / 100) * (item.discount ?? 1)
                    ).toFixed(2)
                  )}
                  title={item.title}
                  image={item.image_link}
                  quantity={item.quantity ?? 1}
                  id={item._id}
                />
              ))
            )}
          </div>
          <div className={styles["order__info"]}>
            <div className={styles["order__status"]}>
              <h4>Order Status</h4>
              {status === Status.LOADING ? (
                <div style={{ width: "100%", paddingBottom: "1rem" }}>
                  <Skeleton height={300} />
                </div>
              ) : (
                <OrderStatus
                  step={userOrder?.status === "Waiting for delivery" ? 3 : 1}
                />
              )}
            </div>
            {status === Status.LOADING ? (
              <div style={{ width: "100%", paddingBottom: "1rem" }}>
                <Skeleton height={300} />
              </div>
            ) : (
              <>
                <h4 className={styles["order__header"]}>Address</h4>
                <div className={styles["info"]}>
                  <p>
                    Country: <span>{userOrder?.address.country}</span>
                  </p>
                  <p>
                    City: <span>{userOrder?.address.city}</span>
                  </p>
                  <p>
                    Street: <span>{userOrder?.address.street}</span>
                  </p>
                  <p>
                    House: <span>{userOrder?.address.house}</span>
                  </p>
                  {userOrder?.address.flat && (
                    <p>
                      Flat: <span>{userOrder?.address.flat}</span>
                    </p>
                  )}
                </div>
                <h4 className={styles["order__header"]}>Contact Info</h4>
                <div className={styles["info"]}>
                  <p>
                    Name: <span>{userOrder?.contact.name}</span>
                  </p>
                  <p>
                    Surname: <span>{userOrder?.contact.surname}</span>
                  </p>
                  <p>
                    Email: <span>{userOrder?.contact.email}</span>
                  </p>
                  <p>
                    Phone: <span>{userOrder?.contact.phone}</span>
                  </p>
                </div>
                <h4 className={styles["order__header"]}>Total Info</h4>
                <div className={styles["info"]}>
                  <p>
                    Items price: <span>${userOrder?.itemsPrice}</span>
                  </p>
                  <p>
                    Delivery price: <span>${userOrder?.deliveryPrice}</span>
                  </p>
                  <p>
                    Your discount: <span>{userOrder?.userDiscount}%</span>
                  </p>
                  <p>
                    Total price: <span>${userOrder?.totalPrice}</span>
                  </p>
                  <p>
                    Payment Method: <span>{userOrder?.paymentMethod}</span>
                  </p>
                  <p>
                    Delivery Method: <span>{userOrder?.deliveryMethod}</span>
                  </p>
                  <p>
                    Ordered at: <span>{userOrder?.createdAt}</span>
                  </p>
                  {userOrder?.deliveredAt && (
                    <p>
                      Delivered at: <span>{userOrder?.deliveredAt}</span>
                    </p>
                  )}
                  <p></p>
                </div>
              </>
            )}
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
