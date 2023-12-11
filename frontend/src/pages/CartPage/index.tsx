import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../components/Layout";
import styles from "./CartPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import CartItem from "../../components/CartItem";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { clear, setPromocode } from "../../redux/cart/slice";
import { fetchPromoCode } from "../../redux/promocode/slice";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { Status } from "../../types";

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cartItems, isPromoActive, promo } = useSelector(
    (state: RootState) => state.cart
  );
  const { promocodes, status } = useSelector(
    (state: RootState) => state.promoCode
  );
  const promocode = promocodes[0] || promo;
  const itemsPrice = cartItems
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

  const [isPromoActiveted, setIsPromoActive] = useState(isPromoActive);
  const [inputValue, setInputValue] = useState(promo?.code || "");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const onSubminPromocode = () => {
    if (cartItems.length <= 0) {
      dispatch(
        showToast({
          toastText: "You need add products to cart before using promo code",
          toastType: toastStatus.INFO,
        })
      );
    } else if (inputValue.length <= 0) {
      dispatch(
        showToast({
          toastText: "You did not enter promo code",
          toastType: toastStatus.INFO,
        })
      );
    } else {
      dispatch(fetchPromoCode({ code: inputValue }));
    }
  };

  const onCheckout = (e: any) => {
    e.preventDefault();
    if (cartItems.length <= 0) {
      dispatch(
        showToast({
          toastText: "You need add products to cart before going to checkout",
          toastType: toastStatus.INFO,
        })
      );
    } else {
      navigate("/checkout");
    }
  };

  const clearCart = () => {
    dispatch(clear());
  };

  useEffect(() => {
    if (status === Status.ERROR) {
      dispatch(
        showToast({
          toastText: "Promo code not found",
          toastType: toastStatus.INFO,
        })
      );
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (
      promocode?.code &&
      promocode.code === inputValue &&
      promocode.isActive
    ) {
      dispatch(
        showToast({
          toastText: "Promo code activated",
          toastType: toastStatus.SUCCESS,
        })
      );
      setIsPromoActive(true);
      dispatch(setPromocode(promocode));
      localStorage.setItem("Promocode", JSON.stringify(promocode));
      localStorage.setItem(
        "IsPromoActive",
        JSON.stringify(promocode?.isActive)
      );
    }
  }, [dispatch, inputValue, promocode]);

  return (
    <Layout>
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <Breadcrumbs last="Cart" />
      <h3>Cart</h3>
      <section className={styles.cart}>
        <div className={styles["cart__items"]}>
          {cartItems.length === 0 ? (
            <MessageBox message=" Cart is empty" type={MessageTypes.INFO} />
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item._id}
                img={item.image_link}
                name={item.title}
                quantity={item.quantity}
                price={
                  item.discount
                    ? (item.price - (item.price / 100) * item.discount).toFixed(
                        2
                      )
                    : item.price
                }
                game={item}
              />
            ))
          )}
        </div>
        <div className={styles["cart__summary"]}>
          <p className={styles["cart__sum"]}>
            Sum:
            <b>$ {itemsPrice}</b>
          </p>
          {isPromoActiveted && (
            <p className={styles["cart__sum"]}>
              With discount:{" "}
              <b>
                $
                {(
                  Number(itemsPrice) -
                  (Number(itemsPrice) / 100) * promocode.discount
                ).toFixed(2)}
              </b>
            </p>
          )}
          <div
            className={
              isPromoActiveted
                ? styles["cart__promocode_active"]
                : styles["cart__promocode"]
            }
          >
            <p>Promocode:</p>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isPromoActiveted}
            />
            {isPromoActiveted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M3 7.5L7.875 14L16 1"
                  stroke="#92E012"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                onClick={onSubminPromocode}
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M3.16699 9.5L7.91699 14.25L15.8337 4.75"
                  stroke="#2A2A2A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <Link to="/checkout" className={styles["buy"]} onClick={onCheckout}>
            Checkout
          </Link>
          <div className={styles["clear"]} onClick={clearCart}>
            Clear cart
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CartPage;
