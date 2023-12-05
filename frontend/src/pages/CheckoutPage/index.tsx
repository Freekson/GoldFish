import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import styles from "./Checkout.module.scss";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { useEffect, useState } from "react";
import { TUserAdress, TUserContact } from "../../types";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { useNavigate } from "react-router";
import { setOrderData } from "../../redux/user/slice";
import axios from "axios";
import { clear } from "../../redux/cart/slice";

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const { cartItems, isPromoActive, promo } = useSelector(
    (state: RootState) => state.cart
  );
  const { userData, orderData } = useSelector((state: RootState) => state.user);
  const totalPrice = cartItems
    .reduce(
      (a, c) =>
        a +
        (c.quantity
          ? c.discount
            ? (c.price - (c.price / 100) * c.discount) * c.quantity
            : c.price * c.quantity
          : 0),
      0
    )
    .toFixed(2);
  const userDiscount =
    (userData?.experience ?? 0) >= 1000
      ? 5
      : (userData?.experience ?? 0) >= 5000
      ? 10
      : (userData?.experience ?? 0) >= 10000
      ? 15
      : 0;
  const totalDiscount = userDiscount + (isPromoActive ? promo ?? 0 : 0);

  const [selectedDelivery, setSelectedDelivery] = useState(
    orderData?.deliveryMethod ?? "pickup"
  );
  const [selectedPayment, setSelectedPayment] = useState(
    orderData?.paymentMethod ?? "paypal"
  );
  const [isPublicOffer, setIsPublicOffer] = useState(false);
  const [isPersonalData, setIsPersonalData] = useState(false);

  const deliveryCost =
    selectedDelivery === "pickup" || selectedDelivery === "pickupLocations"
      ? 0
      : selectedDelivery === "mailDelivery"
      ? 5
      : selectedDelivery === "expressDelivery"
      ? 12
      : 0;

  const [address, setAddress] = useState<TUserAdress>({
    country: orderData?.address.country ?? "",
    city: orderData?.address.city ?? "",
    street: orderData?.address.street ?? "",
    house: orderData?.address.house ?? "",
    flat: orderData?.address.flat ?? "",
  });

  const [contactData, setContactData] = useState<TUserContact>({
    name: orderData?.contact.name ?? "",
    surname: orderData?.contact.surname ?? "",
    email: userData?.email || (orderData?.contact.email ?? ""),
    phone: orderData?.contact.phone ?? "",
  });

  const handleDeliveryChange = (deliveryType: string) => {
    setSelectedDelivery(deliveryType);
  };
  const handlePaymentChange = (payment: string) => {
    setSelectedPayment(payment);
  };
  const handlePublicOffer = (event: any) => {
    setIsPublicOffer(event.target.checked);
  };
  const handlePersonalData = (event: any) => {
    setIsPersonalData(event.target.checked);
  };

  const handleAdressChange = (e: any) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleContactChange = (e: any) => {
    const { name, value } = e.target;
    setContactData((prevContactData) => ({
      ...prevContactData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!isPublicOffer || !isPersonalData) {
      dispatch(
        showToast({
          toastText: "You must fill in the fields with *",
          toastType: toastStatus.INFO,
        })
      );
      return;
    }
    try {
      await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          address: address,
          contact: contactData,
          paymentMethod: selectedPayment,
          deliveryMethod: selectedDelivery,
          itemsPrice: Number(totalPrice),
          deliveryPrice: deliveryCost,
          totalPrice: (Number(totalPrice) + deliveryCost).toFixed(2),
          userDiscount: totalDiscount,
          status: status,
        },
        {
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        }
      );
      const orderData = {
        address,
        contact: contactData,
        paymentMethod: selectedPayment,
        deliveryMethod: selectedDelivery,
      };
      localStorage.setItem("userOrderData", JSON.stringify(orderData));
      dispatch(setOrderData(orderData));

      dispatch(
        showToast({
          toastText: "Order Created Successfuly",
          toastType: toastStatus.SUCCESS,
        })
      );
      dispatch(clear());
    } catch (error) {
      dispatch(
        showToast({
          toastText: `Error wile creating order: ${error}`,
          toastType: toastStatus.ERROR,
        })
      );
    }

    //TODO update routes
    if (selectedPayment === "paypal") {
      navigate("/");
    } else if (selectedPayment === "cash") {
      navigate("/");
    }
  };

  useEffect(() => {
    if (
      selectedDelivery === "pickup" ||
      selectedDelivery === "pickupLocations"
    ) {
      setStatus("Waiting for pick up");
    } else if (selectedPayment === "paypal") {
      setStatus("Waiting for payment");
    } else {
      setStatus("Waiting for delivery");
    }
  }, [selectedDelivery, selectedPayment]);
  return (
    <Layout>
      <Helmet>
        <title>Checkout</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Cart"]}
        pathes={["/", "/cart"]}
        last="Checkout"
      />
      <h3>Checkout</h3>
      <section className={styles["checkout"]}>
        <form
          onSubmit={handleSubmit}
          className={styles["checkout__wrapper"]}
          action="/submit"
          method="post"
        >
          <div className={styles["address"]}>
            <h4>Address</h4>
            <fieldset>
              <div className={styles["address__item"]}>
                Country*{" "}
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={address.country}
                  onChange={handleAdressChange}
                  required
                />
              </div>
              <div className={styles["address__item"]}>
                City*{" "}
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAdressChange}
                  required
                />
              </div>
              <div className={styles["address__item"]}>
                Street*{" "}
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={address.street}
                  onChange={handleAdressChange}
                  required
                />
              </div>
              <div className={styles["address__item"]}>
                House*{" "}
                <input
                  type="text"
                  name="house"
                  placeholder="House"
                  value={address.house}
                  onChange={handleAdressChange}
                  required
                />
              </div>
              <div className={styles["address__item"]}>
                Flat{" "}
                <input
                  type="text"
                  name="flat"
                  placeholder="Flat"
                  value={address.flat}
                  onChange={handleAdressChange}
                />
              </div>
            </fieldset>
            <p className={styles["warning"]}>* Required fields</p>
          </div>
          <div className={styles["delivery"]}>
            <h4>Delivery method</h4>
            <div className={styles["delivery__wrapper"]}>
              <div className={styles["delivery__item"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <path
                    d="M19.7998 20.6998V26.0998C19.7998 26.3385 19.8946 26.5674 20.0634 26.7362C20.2322 26.905 20.4611 26.9998 20.6998 26.9998H26.0998C26.3385 26.9998 26.5674 26.905 26.7362 26.7362C26.905 26.5674 26.9998 26.3385 26.9998 26.0998V20.6998C26.9998 20.4611 26.905 20.2322 26.7362 20.0634C26.5674 19.8946 26.3385 19.7998 26.0998 19.7998H20.6998C20.4611 19.7998 20.2322 19.8946 20.0634 20.0634C19.8946 20.2322 19.7998 20.4611 19.7998 20.6998ZM21.5998 25.1998V21.5998H25.1998V25.1998H21.5998Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M8.99961 3.59961C8.86769 3.59966 8.7374 3.62871 8.61796 3.6847C8.49851 3.74069 8.39284 3.82225 8.30841 3.92361L3.80841 9.32361C3.67359 9.48528 3.5997 9.6891 3.59961 9.89961V12.5996C3.59961 14.198 4.29441 15.6362 5.39961 16.6244V31.4996C5.39961 31.7383 5.49443 31.9672 5.66321 32.136C5.832 32.3048 6.06091 32.3996 6.29961 32.3996H29.6996C29.9383 32.3996 30.1672 32.3048 30.336 32.136C30.5048 31.9672 30.5996 31.7383 30.5996 31.4996V16.6244C31.7048 15.6344 32.3996 14.198 32.3996 12.5996V9.89961V9.86721C32.3996 9.70521 32.3996 9.57561 32.1908 9.32361L27.6908 3.92361C27.6064 3.82225 27.5007 3.74069 27.3813 3.6847C27.2618 3.62871 27.1315 3.59966 26.9996 3.59961H8.99961ZM8.99961 16.1996C8.04483 16.1996 7.12916 15.8203 6.45402 15.1452C5.77889 14.4701 5.39961 13.5544 5.39961 12.5996V10.7996H12.5996V12.5996C12.5996 13.5544 12.2203 14.4701 11.5452 15.1452C10.8701 15.8203 9.95439 16.1996 8.99961 16.1996ZM17.9996 16.1996C17.0448 16.1996 16.1292 15.8203 15.454 15.1452C14.7789 14.4701 14.3996 13.5544 14.3996 12.5996V10.7996H21.5996V12.5996C21.5996 13.5544 21.2203 14.4701 20.5452 15.1452C19.8701 15.8203 18.9544 16.1996 17.9996 16.1996ZM26.9996 16.1996C26.0448 16.1996 25.1292 15.8203 24.454 15.1452C23.7789 14.4701 23.3996 13.5544 23.3996 12.5996V10.7996H30.5996V12.5996C30.5996 13.5544 30.2203 14.4701 29.5452 15.1452C28.8701 15.8203 27.9544 16.1996 26.9996 16.1996ZM8.99961 30.5996H7.19961V17.6936C8.33415 18.0958 9.57059 18.1069 10.7122 17.7253C11.8538 17.3437 12.835 16.5912 13.4996 15.5876C13.9922 16.33 14.661 16.9388 15.4462 17.3597C16.2314 17.7806 17.1087 18.0004 17.9996 17.9996C18.8907 18.0002 19.7681 17.7801 20.5533 17.3589C21.3386 16.9377 22.0072 16.3285 22.4996 15.5858C23.1642 16.5894 24.1454 17.3419 25.287 17.7235C26.4286 18.1051 27.6651 18.094 28.7996 17.6918V30.5996H17.9996V20.6996C17.9996 20.4609 17.9048 20.232 17.736 20.0632C17.5672 19.8944 17.3383 19.7996 17.0996 19.7996H9.89961C9.66091 19.7996 9.432 19.8944 9.26321 20.0632C9.09443 20.232 8.99961 20.4609 8.99961 20.6996V30.5996ZM12.8516 8.99961H6.42201L9.42081 5.39961H14.0504L12.8516 8.99961ZM21.2504 8.99961H14.7488L15.9476 5.39961H20.0516L21.2504 8.99961ZM23.1476 8.99961L21.9488 5.39961H26.5784L29.579 8.99961H23.1476ZM10.7996 30.5996V21.5996H16.1996V30.5996H10.7996Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <div>
                  <b>Pickup from the store</b>
                  <p>Free, today</p>
                </div>
                <input
                  type="checkbox"
                  id="delivery-1"
                  checked={selectedDelivery === "pickup"}
                  onChange={() => handleDeliveryChange("pickup")}
                />
                <label htmlFor="delivery-1"></label>
              </div>
              <div className={styles["delivery__item"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="40"
                  viewBox="0 0 38 40"
                  fill="none"
                >
                  <path
                    d="M12.0837 4.1875C10.342 4.1875 8.91699 5.65169 8.91699 7.44125V31.8444C8.91699 32.7074 9.25062 33.535 9.84449 34.1452C10.4384 34.7554 11.2438 35.0982 12.0837 35.0982V36.725H15.2503V35.0982H24.7503V36.725H27.917V35.0982C29.6745 35.0982 31.0837 33.6502 31.0837 31.8444V7.44125C31.0837 6.5783 30.75 5.7507 30.1562 5.1405C29.5623 4.53031 28.7568 4.1875 27.917 4.1875H12.0837ZM12.0837 7.44125H27.917V12.3219H12.0837V7.44125ZM12.0837 15.5756H27.917V20.4563H12.0837V15.5756ZM12.0837 23.71H18.417V31.8444H12.0837V23.71ZM21.5837 23.71H27.917V31.8444H21.5837V23.71ZM13.667 25.3369V30.2175H16.8337V25.3369H13.667ZM23.167 25.3369V30.2175H26.3337V25.3369H23.167Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <div>
                  <b>Pickup from 761 locations</b>
                  <p>Free, 1 day</p>
                </div>
                <input
                  type="checkbox"
                  id="delivery-2"
                  checked={selectedDelivery === "pickupLocations"}
                  onChange={() => handleDeliveryChange("pickupLocations")}
                />{" "}
                <label htmlFor="delivery-2"></label>
              </div>
              <div className={styles["delivery__item"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="39"
                  viewBox="0 0 38 39"
                  fill="none"
                >
                  <path
                    d="M4.75 19.043H19V21.4207H4.75V19.043Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M2.375 13.0977H14.25V15.4754H2.375V13.0977Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M35.529 19.7625L31.9665 11.4404C31.8751 11.2265 31.7229 11.0442 31.5289 10.9161C31.3349 10.788 31.1076 10.7198 30.8752 10.7199H27.3127V8.34219C27.3127 8.02688 27.1876 7.72449 26.9649 7.50153C26.7422 7.27858 26.4402 7.15332 26.1252 7.15332H7.12521V9.53107H24.9377V24.4586C24.3966 24.7731 23.9231 25.1918 23.5444 25.6905C23.1657 26.1892 22.8894 26.758 22.7313 27.3642H15.2691C14.9801 26.2435 14.2927 25.2668 13.3358 24.6172C12.379 23.9675 11.2183 23.6896 10.0714 23.8355C8.9245 23.9813 7.87009 24.5409 7.10583 25.4094C6.34157 26.2779 5.91992 27.3956 5.91992 28.553C5.91992 29.7105 6.34157 30.8282 7.10583 31.6967C7.87009 32.5652 8.9245 33.1248 10.0714 33.2706C11.2183 33.4165 12.379 33.1385 13.3358 32.4889C14.2927 31.8393 14.9801 30.8626 15.2691 29.7419H22.7313C22.9897 30.7623 23.5804 31.6672 24.4102 32.3137C25.24 32.9601 26.2613 33.3111 27.3127 33.3111C28.3641 33.3111 29.3855 32.9601 30.2152 32.3137C31.045 31.6672 31.6358 30.7623 31.8941 29.7419H34.4377C34.7527 29.7419 35.0547 29.6167 35.2774 29.3937C35.5001 29.1707 35.6252 28.8684 35.6252 28.553V20.2309C35.6253 20.0699 35.5925 19.9105 35.529 19.7625ZM10.6877 30.9308C10.218 30.9308 9.7588 30.7913 9.36824 30.5301C8.97767 30.2688 8.67326 29.8974 8.4935 29.463C8.31374 29.0285 8.26671 28.5504 8.35835 28.0892C8.44999 27.6279 8.67619 27.2043 9.00834 26.8717C9.34049 26.5392 9.76367 26.3127 10.2244 26.221C10.6851 26.1292 11.1626 26.1763 11.5966 26.3563C12.0306 26.5363 12.4015 26.841 12.6625 27.232C12.9234 27.6231 13.0627 28.0828 13.0627 28.553C13.0621 29.1835 12.8117 29.7879 12.3664 30.2337C11.9211 30.6794 11.3174 30.9302 10.6877 30.9308ZM27.3127 13.0977H30.0915L32.6375 19.0421H27.3127V13.0977ZM27.3127 30.9308C26.843 30.9308 26.3838 30.7913 25.9932 30.5301C25.6027 30.2688 25.2983 29.8974 25.1185 29.463C24.9387 29.0285 24.8917 28.5504 24.9833 28.0892C25.075 27.6279 25.3012 27.2043 25.6333 26.8717C25.9655 26.5392 26.3887 26.3127 26.8494 26.221C27.3101 26.1292 27.7876 26.1763 28.2216 26.3563C28.6556 26.5363 29.0265 26.841 29.2875 27.232C29.5484 27.6231 29.6877 28.0828 29.6877 28.553C29.6871 29.1835 29.4367 29.7879 28.9914 30.2337C28.5461 30.6794 27.9424 30.9302 27.3127 30.9308ZM33.2502 27.3642H31.8941C31.6325 26.3458 31.0408 25.4432 30.2117 24.7977C29.3826 24.1522 28.363 23.8005 27.3127 23.7976V21.4198H33.2502V27.3642Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <div>
                  <b>Express delivery</b>
                  <p>From $12, 1 day</p>
                </div>
                <input
                  type="checkbox"
                  id="delivery-3"
                  checked={selectedDelivery === "expressDelivery"}
                  onChange={() => handleDeliveryChange("expressDelivery")}
                />{" "}
                <label htmlFor="delivery-3"></label>
              </div>
              <div className={styles["delivery__item"]}>
                <svg
                  width="34"
                  height="35"
                  viewBox="0 0 34 35"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_442_15572)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.2412 0.929209C17.8643 0.711365 17.4368 0.59668 17.0016 0.59668C16.5664 0.59668 16.1389 0.711365 15.762 0.929209L4.07454 7.68318C3.69778 7.90095 3.38488 8.21416 3.1673 8.59133C2.94971 8.9685 2.8351 9.39635 2.83496 9.83191V23.3413C2.83496 24.2277 3.30813 25.0475 4.07454 25.49L15.762 32.2454C16.1389 32.4632 16.5664 32.5779 17.0016 32.5779C17.4368 32.5779 17.8643 32.4632 18.2412 32.2454L29.9287 25.4914C30.3057 25.2735 30.6187 24.9601 30.8363 24.5826C31.0539 24.2052 31.1684 23.7771 31.1683 23.3413V9.83191C31.1682 9.39635 31.0535 8.9685 30.836 8.59133C30.6184 8.21416 30.3055 7.90095 29.9287 7.68318L18.2412 0.927791V0.929209ZM16.8245 2.77017C16.8784 2.73905 16.9395 2.72266 17.0016 2.72266C17.0638 2.72266 17.1249 2.73905 17.1787 2.77017L27.9808 9.01355L17.0016 15.359L6.02246 9.01355L16.8245 2.77017ZM4.95996 10.8573V23.3427C4.95996 23.4703 5.02796 23.5866 5.13704 23.649L15.9391 29.8924V17.2028L4.95996 10.8573ZM18.0641 29.8924L28.8662 23.649C28.9199 23.618 28.9646 23.5733 28.9957 23.5196C29.0267 23.4658 29.0432 23.4048 29.0433 23.3427V10.8559L18.0641 17.2014V29.891V29.8924Z"
                      fill="#2A2A2A"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_442_15572">
                      <rect
                        width="34"
                        height="34.0393"
                        fill="white"
                        transform="translate(0 0.0224609)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div>
                  <b>Mail delivery</b>
                  <p>From $5, from 3 days</p>
                </div>
                <input
                  type="checkbox"
                  id="delivery-4"
                  checked={selectedDelivery === "mailDelivery"}
                  onChange={() => handleDeliveryChange("mailDelivery")}
                />{" "}
                <label htmlFor="delivery-4"></label>
              </div>
            </div>
          </div>
          <div className={styles["payment"]}>
            <h4>Payment method</h4>
            <div className={styles["payment__wrapper"]}>
              <div className={styles["payment__item"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="36"
                  viewBox="0 0 35 36"
                  fill="none"
                >
                  <path
                    d="M0 8.99431C0 7.83265 0.460936 6.71856 1.28141 5.89714C2.10188 5.07573 3.21468 4.61426 4.375 4.61426H30.625C31.7853 4.61426 32.8981 5.07573 33.7186 5.89714C34.5391 6.71856 35 7.83265 35 8.99431V26.5145C35 27.6762 34.5391 28.7903 33.7186 29.6117C32.8981 30.4331 31.7853 30.8946 30.625 30.8946H4.375C3.21468 30.8946 2.10188 30.4331 1.28141 29.6117C0.460936 28.7903 0 27.6762 0 26.5145V8.99431ZM4.375 6.80428C3.79484 6.80428 3.23844 7.03502 2.8282 7.44573C2.41797 7.85644 2.1875 8.41348 2.1875 8.99431V11.1843H32.8125V8.99431C32.8125 8.41348 32.582 7.85644 32.1718 7.44573C31.7616 7.03502 31.2052 6.80428 30.625 6.80428H4.375ZM32.8125 15.5644H2.1875V26.5145C2.1875 27.0953 2.41797 27.6524 2.8282 28.0631C3.23844 28.4738 3.79484 28.7045 4.375 28.7045H30.625C31.2052 28.7045 31.7616 28.4738 32.1718 28.0631C32.582 27.6524 32.8125 27.0953 32.8125 26.5145V15.5644Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M4.375 22.1344C4.375 21.5535 4.60547 20.9965 5.0157 20.5858C5.42594 20.1751 5.98234 19.9443 6.5625 19.9443H8.75C9.33016 19.9443 9.88656 20.1751 10.2968 20.5858C10.707 20.9965 10.9375 21.5535 10.9375 22.1344V24.3244C10.9375 24.9052 10.707 25.4623 10.2968 25.873C9.88656 26.2837 9.33016 26.5144 8.75 26.5144H6.5625C5.98234 26.5144 5.42594 26.2837 5.0157 25.873C4.60547 25.4623 4.375 24.9052 4.375 24.3244V22.1344Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <div>
                  <b>Payment by card</b>
                  <p>PayPal</p>
                </div>
                <input
                  type="checkbox"
                  id="payment-1"
                  checked={selectedPayment === "paypal"}
                  onChange={() => handlePaymentChange("paypal")}
                />
                <label htmlFor="payment-1"></label>
              </div>
              <div className={styles["payment__item"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="31"
                  viewBox="0 0 33 31"
                  fill="none"
                >
                  <path
                    d="M33 26.125C33 26.6773 32.5523 27.125 32 27.125H5.09375C4.55872 27.125 4.125 26.6913 4.125 26.1562C4.125 25.6212 4.55872 25.1875 5.09375 25.1875H29.9375C30.4898 25.1875 30.9375 24.7398 30.9375 24.1875V12.625C30.9375 12.0727 31.3852 11.625 31.9375 11.625H32C32.5523 11.625 33 12.0727 33 12.625V26.125Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M25.8125 7.75C26.3648 7.75 26.8125 8.19772 26.8125 8.75V20.3125C26.8125 20.8648 26.3648 21.3125 25.8125 21.3125H3.0625C2.51021 21.3125 2.0625 20.8648 2.0625 20.3125V8.75C2.0625 8.19772 2.51022 7.75 3.0625 7.75H25.8125ZM28.875 6.8125C28.875 6.26022 28.4273 5.8125 27.875 5.8125H1C0.447715 5.8125 0 6.26022 0 6.8125V22.25C0 22.8023 0.447715 23.25 1 23.25H27.875C28.4273 23.25 28.875 22.8023 28.875 22.25V6.8125Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M6.1875 11.625H4.125V17.4375H6.1875V19.375H14.4375C13.07 19.375 11.7585 18.8647 10.7915 17.9563C9.8245 17.0479 9.28125 15.8159 9.28125 14.5312C9.28125 13.2466 9.8245 12.0146 10.7915 11.1062C11.7585 10.1978 13.07 9.6875 14.4375 9.6875H6.1875V11.625Z"
                    fill="#2A2A2A"
                  />
                  <path
                    d="M22.6875 11.625V9.6875H14.4375C15.805 9.6875 17.1165 10.1978 18.0835 11.1062C19.0505 12.0146 19.5938 13.2466 19.5938 14.5312C19.5938 15.8159 19.0505 17.0479 18.0835 17.9563C17.1165 18.8647 15.805 19.375 14.4375 19.375H22.6875V17.4375H24.75V11.625H22.6875Z"
                    fill="#2A2A2A"
                  />
                </svg>
                <div>
                  <b>Cash payment</b>
                  <p>To the courier upon receipt</p>
                </div>
                <input
                  type="checkbox"
                  id="payment-2"
                  checked={selectedPayment === "cash"}
                  onChange={() => handlePaymentChange("cash")}
                />
                <label htmlFor="payment-2"></label>
              </div>
            </div>
          </div>
          <div className={styles["contact"]}>
            <h4>Contact details</h4>
            <fieldset>
              <div className={styles["contact__item"]}>
                Name*{" "}
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={contactData.name}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className={styles["contact__item"]}>
                Surname*{" "}
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={contactData.surname}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className={styles["contact__item"]}>
                E-mail*{" "}
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={contactData.email}
                  onChange={handleContactChange}
                  required
                />
              </div>
              <div className={styles["contact__item"]}>
                Phone*{" "}
                <input
                  type="text"
                  name="phone"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  placeholder="___-___-____"
                  value={contactData.phone}
                  onChange={handleContactChange}
                  required
                />
              </div>
            </fieldset>
            <p className={styles["warning"]}>* Required fields</p>
          </div>
          <div className={styles["agreements"]}>
            <div>
              <input
                type="checkbox"
                id="agreement-1"
                checked={isPublicOffer}
                onChange={handlePublicOffer}
              />
              <label htmlFor="agreement-1">
                I have read and agree with the provisions of the{" "}
                <u>Public Offer</u>
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="agreement-2"
                checked={isPersonalData}
                onChange={handlePersonalData}
              />
              <label htmlFor="agreement-2">
                I agree to the <u>processing of personal data</u>
              </label>
            </div>
          </div>
          <div className={styles["results"]}>
            <h4>Total</h4>
            <div className={styles["results__wrapper"]}>
              <div>
                <p>Order price</p> <b>${totalPrice}</b>
              </div>
              <div>
                <p>Cost of delivery</p> <b>${deliveryCost}</b>
              </div>
              {userDiscount > 0 && (
                <div>
                  <p>Loyality discount</p> <b>{userDiscount}%</b>
                </div>
              )}
              {isPromoActive && (
                <div>
                  <p>Discount from promocode</p> <b>{promo}%</b>
                </div>
              )}
              <div>
                <p>Amount to be paid</p>{" "}
                <b className={styles["total"]}>
                  $
                  {(
                    Number(totalPrice) -
                    (Number(totalPrice) / 100) * (promo ?? 0) -
                    (Number(totalPrice) / 100) * (userDiscount ?? 0) +
                    deliveryCost
                  ).toFixed(2)}
                </b>
              </div>
            </div>
          </div>
          <div className={styles["btn"]}>
            <button type="submit" className={styles["active-btn"]}>
              Checkout
            </button>
          </div>
        </form>
        <div className={styles["checkout__total"]}>
          <p className={styles["total"]}>
            There are {cartItems.length} items in the cart worth ${totalPrice} :
          </p>
          {cartItems.map((item) => (
            <div className={styles["total__item"]} key={item._id}>
              <p className={styles["name"]}>{item.title}</p>
              <p>
                {item.quantity} pcs. <span>${item.price} each</span>
                <span>${item.price * (item.quantity ?? 0)} in total</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
