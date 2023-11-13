import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import Layout from "../../components/Layout";
import styles from "./CartPage.module.scss";
import { Link } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import CartItem from "../../components/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { clear } from "../../redux/cart/slice";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();

  const [isPromoActive, setIsPromoActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const onSubminPromocode = () => {
    setIsPromoActive(true);
  };
  const clearCart = () => {
    dispatch(clear());
  };

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
            <b>
              ${" "}
              {cartItems
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
                .toFixed(2)}
            </b>
          </p>
          {isPromoActive && (
            <p className={styles["cart__sum"]}>
              With discount: <b>$200</b>
            </p>
          )}
          <div
            className={
              isPromoActive
                ? styles["cart__promocode_active"]
                : styles["cart__promocode"]
            }
          >
            <p>Promocode:</p>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isPromoActive}
            />
            {isPromoActive ? (
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
          <Link to="/checkout" className={styles["buy"]}>
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
