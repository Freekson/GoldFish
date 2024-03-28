import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import styles from "./WishlistPage.module.scss";
import GameCard from "../../components/GameCard";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchWishlist } from "../../redux/wishlist/slice";
import GameCardSkeleton from "../../components/GameCard/GameCardSkeleton";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { Status } from "../../types";

const WishlistPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { items, status } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    if (userData) {
      dispatch(fetchWishlist({ id: userData._id, token: userData.token }));
    }
  }, [dispatch, userData]);

  return (
    <Layout>
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile"]}
        pathes={["/", "/profile"]}
        last="Wishlist"
      />
      <h3>Your Wishlist</h3>
      <section className={styles["wishlist__wrapper"]}>
        {status === Status.ERROR ? (
          <MessageBox
            message="An error occurred while loading games, we are working on it"
            type={MessageTypes.DANGER}
            customStyles={{ marginTop: "1rem" }}
          />
        ) : status === Status.LOADING ? (
          <GameCardSkeleton items={8} />
        ) : items.length <= 0 ? (
          <MessageBox
            message="Your wishlist is empty"
            type={MessageTypes.INFO}
            customStyles={{ marginTop: "1rem" }}
          />
        ) : (
          items.map((item) => (
            <GameCard
              game={item}
              isDiscount={item.discount ? true : false}
              discount={item.discount}
              key={item._id}
            />
          ))
        )}
      </section>
    </Layout>
  );
};

export default WishlistPage;
