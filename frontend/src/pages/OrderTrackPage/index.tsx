import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./OrderTackPage.module.scss";
import OrderStatus, { EStatusType } from "../../components/OrderStatus";
import OrderProduct from "../../components/OrderProduct";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchOrder } from "../../redux/order/slice";
import { useParams } from "react-router-dom";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { Status } from "../../types";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../utils/formatDate";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import OpenedCard from "../../components/OpenedCard";

const OrderTrackPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { userOrder, status } = useSelector((state: RootState) => state.order);
  const { id } = useParams();

  const [orderStatus, setOrderStatus] = useState<EStatusType>(EStatusType.post);
  const [orderStep, setOrderStep] = useState(0);
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");

  useEffect(() => {
    if (userOrder?.deliveryMethod) {
      let deliveryMethodText = "";

      switch (userOrder.deliveryMethod) {
        case "expressDelivery":
          deliveryMethodText = "Express Delivery";
          break;
        case "pickupLocations":
          deliveryMethodText = "Pick up from our partners";
          break;
        case "pickup":
          deliveryMethodText = "Pick up from our store";
          break;
        case "mailDelivery":
          deliveryMethodText = "Mail Delivery";
          break;
        default:
          break;
      }

      setDeliveryMethod(deliveryMethodText);
    }
  }, [userOrder?.deliveryMethod]);

  useEffect(() => {
    if (userOrder?.createdAt) {
      const newDate = new Date(userOrder.createdAt);
      setOrderDate(formatDate(newDate));
    }
    if (userOrder?.deliveredAt) {
      const newDate = new Date(userOrder.createdAt);
      setDeliveryDate(formatDate(newDate));
    }
  }, [userOrder?.createdAt, userOrder?.deliveredAt]);

  useEffect(() => {
    dispatch(fetchOrder({ token: userData?.token ?? "", id: id ?? "" }));
  }, [dispatch, id, userData?.token]);

  useEffect(() => {
    if (
      userOrder?.deliveryMethod === "pickup" ||
      userOrder?.deliveryMethod === "pickupLocations"
    ) {
      setOrderStatus(EStatusType.store);

      if (userOrder.status === "Waiting for pick up") {
        setOrderStep(1);
      } else if (userOrder.status === "Picked up") {
        setOrderStep(3);
      }
    } else if (userOrder?.paymentMethod === "paypal") {
      setOrderStatus(EStatusType.post);

      if (userOrder.status === "Waiting for payment") {
        setOrderStep(1);
      } else if (userOrder.status === "Waiting for delivery") {
        setOrderStep(3);
      } else if (userOrder.status === "Delivered") {
        setOrderStep(5);
      }
    } else {
      setOrderStatus(EStatusType.cash);
      if (userOrder?.status === "Waiting for delivery") {
        setOrderStep(1);
      } else if (userOrder?.status === "Delivered") {
        setOrderStep(5);
      }
    }
  }, [userOrder?.deliveryMethod, userOrder?.paymentMethod, userOrder?.status]);

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
                <OrderStatus step={orderStep} statusType={orderStatus} />
              )}
            </div>
            {status === Status.LOADING ? (
              <div style={{ width: "100%", paddingBottom: "1rem" }}>
                <Skeleton height={300} />
              </div>
            ) : (
              <>
                <OpenedCard
                  title="Order Info"
                  description={
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
                        Payment Method:{" "}
                        <span>
                          {capitalizeFirstLetter(
                            userOrder?.paymentMethod
                              ? userOrder?.paymentMethod
                              : ""
                          )}
                        </span>
                      </p>
                      <p>
                        Delivery Method: <span>{deliveryMethod}</span>
                      </p>
                      <p>
                        Ordered at: <span>{orderDate}</span>
                      </p>
                      {userOrder?.deliveredAt && (
                        <p>
                          Delivered at: <span>{deliveryDate}</span>
                        </p>
                      )}
                      <p></p>
                    </div>
                  }
                />
                <hr className={styles["hr"]} />
                <OpenedCard
                  title="Address"
                  description={
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
                  }
                />
                <hr className={styles["hr"]} />
                <OpenedCard
                  title="Contact Info"
                  description={
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
                  }
                />
                <hr className={styles["hr"]} />
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
