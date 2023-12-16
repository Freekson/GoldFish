import styles from "./GameCard.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addItem } from "../../redux/cart/slice";
import { IGame } from "../../types";
import { RootState, useAppDispatch } from "../../redux/store";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { addGame, removeGame } from "../../redux/wishlist/slice";

type TProps = {
  _id: string;
  image_link: string;
  title: string;
  price: number;
  isDiscount?: boolean;
  discount?: number;
  game: IGame;
};

const GameCard: React.FC<TProps> = ({
  _id,
  image_link,
  title,
  price,
  isDiscount = false,
  discount,
  game,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { items } = useSelector((state: RootState) => state.wishlist);

  const item = cartItems.find((item) => item._id === _id);

  const [inWishlist, setInWishlist] = useState(
    items ? items.some((game) => game._id === _id) : false
  );

  const addToCart = () => {
    dispatch(addItem(game));
  };

  const { userData } = useSelector((state: RootState) => state.user);

  const onClickHeart = () => {
    if (userData) {
      if (inWishlist) {
        axios.delete(`/api/wishlist/remove`, {
          data: { userId: userData._id, gameId: _id },
          headers: { Authorization: `Bearer ${userData?.token}` },
        });
        dispatch(removeGame(game));
        toast.success("Game removed from wishlist");
      } else {
        axios.post(
          `/api/wishlist/add`,
          { userId: userData._id, gameId: _id },
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          }
        );
        dispatch(addGame(game));
        toast.success("Game added to wishlist");
      }
      setInWishlist(!inWishlist);
    } else {
      toast.info("You must be logged in to do this");
    }
  };

  return (
    <div className={styles.card}>
      {isDiscount ? <p className={styles.discount}>{discount}%</p> : ""}
      {inWishlist ? (
        <svg
          className={styles.heart}
          onClick={onClickHeart}
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="16"
          viewBox="0 0 512 512"
        >
          <path
            d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"
            fill="#FFD3E0"
          />
        </svg>
      ) : (
        <svg
          className={styles.heart}
          onClick={onClickHeart}
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="16"
          viewBox="0 0 512 512"
        >
          <path
            d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"
            fill="#FFD3E0"
          />
        </svg>
      )}
      <Link to={`/product/${_id}`}>
        <img src={image_link} alt={title} />
      </Link>
      <Link to={`/product/${_id}`} className={styles.title}>
        {title}
      </Link>
      {isDiscount && discount ? (
        <p className={styles.price}>
          <span className={styles.old}>${price}</span>
          <span>${(price - (price / 100) * discount).toFixed(2)}</span>
        </p>
      ) : (
        <p className={styles.price}>${price}</p>
      )}
      <div
        className={!item ? styles["buy"] : styles["buy_active"]}
        onClick={addToCart}
      >
        {!item ? (
          <>
            Add to Cart
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M8.146 19.5557C8.90539 19.5557 9.521 18.9401 9.521 18.1807C9.521 17.4213 8.90539 16.8057 8.146 16.8057C7.3866 16.8057 6.771 17.4213 6.771 18.1807C6.771 18.9401 7.3866 19.5557 8.146 19.5557Z"
                fill="white"
              />
              <path
                d="M16.5 19.5557C17.2594 19.5557 17.875 18.9401 17.875 18.1807C17.875 17.4213 17.2594 16.8057 16.5 16.8057C15.7406 16.8057 15.125 17.4213 15.125 18.1807C15.125 18.9401 15.7406 19.5557 16.5 19.5557Z"
                fill="white"
              />
              <path
                d="M20.2155 3.28185C20.1587 3.21175 20.087 3.15511 20.0056 3.11602C19.9242 3.07692 19.8352 3.05633 19.745 3.05574H7.02163L7.41886 4.27796H18.9444L17.3127 11.6113H8.14608L5.3533 2.76852C5.32309 2.67468 5.27063 2.58955 5.2004 2.52039C5.13017 2.45122 5.04425 2.40007 4.94997 2.37129L2.44441 1.60129C2.36737 1.57762 2.28642 1.56935 2.20618 1.57696C2.12594 1.58457 2.04799 1.60791 1.97677 1.64565C1.83294 1.72186 1.72528 1.85209 1.67747 2.00768C1.62965 2.16328 1.64561 2.33149 1.72182 2.47532C1.79803 2.61915 1.92826 2.72681 2.08385 2.77463L4.27774 3.44685L7.08274 12.308L6.08052 13.1268L6.00108 13.2063C5.75317 13.492 5.61266 13.8552 5.60373 14.2333C5.59481 14.6115 5.71804 14.9809 5.95219 15.278C6.11875 15.4805 6.33041 15.6413 6.57023 15.7474C6.81005 15.8535 7.07137 15.902 7.3333 15.8891H17.5327C17.6948 15.8891 17.8503 15.8247 17.9649 15.7101C18.0795 15.5955 18.1439 15.44 18.1439 15.278C18.1439 15.1159 18.0795 14.9604 17.9649 14.8458C17.8503 14.7312 17.6948 14.6668 17.5327 14.6668H7.23552C7.16515 14.6644 7.09659 14.6439 7.03646 14.6073C6.97633 14.5707 6.92666 14.5191 6.89226 14.4577C6.85785 14.3963 6.83987 14.327 6.84006 14.2566C6.84024 14.1862 6.85858 14.117 6.8933 14.0557L8.36608 12.8335H17.8016C17.9429 12.837 18.081 12.7914 18.1924 12.7044C18.3038 12.6175 18.3817 12.4947 18.4127 12.3568L20.35 3.80129C20.3686 3.71019 20.3661 3.61604 20.3428 3.52603C20.3195 3.43601 20.276 3.3525 20.2155 3.28185Z"
                fill="white"
              />
            </svg>
          </>
        ) : (
          <p>
            In Cart{" "}
            <span className={styles.quantity}>
              {item?.quantity && item?.quantity}
            </span>
          </p>
        )}
      </div>
      <div
        className={styles["buy-now"]}
        onClick={() => {
          navigate("/checkout");
          addToCart();
        }}
      >
        Buy in 1 click
      </div>
    </div>
  );
};

export default GameCard;
