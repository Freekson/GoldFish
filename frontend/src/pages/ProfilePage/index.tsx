import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ProfilePage.module.scss";
import UserOrder from "../../components/UserOrder";
import { Link } from "react-router-dom";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { fetchLastThreeOrders } from "../../redux/order/slice";
import Skeleton from "react-loading-skeleton";
import { Status } from "../../types";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import GameCard from "../../components/GameCard";
import { fetchWishlist } from "../../redux/wishlist/slice";
import GameCardSkeleton from "../../components/GameCard/GameCardSkeleton";
import OpenedCard from "../../components/OpenedCard";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { lastOrders, status } = useSelector((state: RootState) => state.order);
  const { items, status: wishlistStatus } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [currentLevel, setCurrentLevel] = useState(0);

  const currentExp = userData?.experience ?? 0;
  const level =
    currentExp >= 10000
      ? 3
      : currentExp >= 5000
      ? 2
      : currentExp >= 1000
      ? 1
      : 0;

  useEffect(() => {
    if (currentExp < 1000) {
      setCurrentLevel(1000);
    } else if (currentExp < 5000) {
      setCurrentLevel(5000);
    } else {
      setCurrentLevel(10000);
    }
  }, [currentExp]);

  useEffect(() => {
    dispatch(fetchLastThreeOrders({ token: userData?.token ?? "" }));
  }, [dispatch, userData?.token]);

  useEffect(() => {
    const fetchData = async () => {
      if (userData) {
        await dispatch(
          fetchWishlist({ id: userData._id, token: userData.token })
        );
      }
    };
    fetchData();
  }, [dispatch, userData]);

  return (
    <Layout>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Breadcrumbs last="Profile" />
      <h3>Profile</h3>
      <section className={styles["user"]}>
        <div className={styles["user__info"]}>
          <div>
            <div className={styles["user__image"]}>
              <img
                src={userData?.image ? userData.image : "/img/user-photo.png"}
                alt="user"
              />
            </div>
            <b>{userData ? userData.name : "User name"}</b>
          </div>
          <div>
            <p className={styles["user__status"]}>
              Status:{" "}
              <span>
                {userData?.isAdmin && "Admin"}
                {userData?.isAuthor && !userData?.isAdmin && "Author"}
                {!userData?.isAdmin && !userData?.isAuthor && "Standard User"}
              </span>
            </p>
          </div>
          {userData?.isAuthor && (
            <div className={styles["user__author"]}>
              <OpenedCard
                title={"Author panel"}
                description={
                  <>
                    <Link to="/author/create">Create new article</Link>
                    <Link to="/author/management">Article management</Link>
                    <Link to="/author/dashboard">Dashboard</Link>
                  </>
                }
              />
            </div>
          )}
        </div>
        <div className={styles["user__achievements"]}>
          <h4>Loyalty card</h4>
          <div className={styles["card"]}>
            <img src={`img/card-${level}.png`} alt="card" />
            <div className={styles["achievements"]}>
              <div
                className={
                  currentExp < 1000
                    ? `${styles.achievements__item} ${styles.closed}`
                    : styles["achievements__item"]
                }
              >
                <div>
                  <img src="/img/achievement-1.png" alt="achievements" />
                </div>
                <p className={styles["name"]}>
                  5% "Newbie" <br />
                  <span>
                    {currentExp >= 1000
                      ? "Received"
                      : currentExp >= 0
                      ? "In Progress"
                      : "Closed"}
                  </span>
                </p>
                <b>1000</b>
              </div>
              <div
                className={
                  currentExp < 5000
                    ? `${styles.achievements__item} ${styles.closed}`
                    : styles["achievements__item"]
                }
              >
                <div>
                  <img src="/img/achievement-2.png" alt="achievements" />
                </div>
                <p className={styles["name"]}>
                  10% "Amateur" <br />
                  <span>
                    {currentExp >= 5000
                      ? "Received"
                      : currentExp >= 1000
                      ? "In Progress"
                      : "Closed"}
                  </span>{" "}
                </p>
                <b>5000</b>
              </div>
              <div
                className={
                  currentExp < 10000
                    ? `${styles.achievements__item} ${styles.closed}`
                    : styles["achievements__item"]
                }
              >
                <div>
                  <img src="/img/achievement-3.png" alt="achievements" />
                </div>
                <p className={styles["name"]}>
                  15% "Professional" <br />
                  <span>
                    {currentExp >= 10000
                      ? "Received"
                      : currentExp >= 5000
                      ? "In Progress"
                      : "Closed"}
                  </span>
                </p>
                <b>10000</b>
              </div>
            </div>
          </div>
          <div className={styles["progress"]}>
            <progress
              id="myProgressBar"
              value={currentExp}
              max={currentLevel}
            ></progress>
            <b>
              {userData?.experience}/{currentLevel}
            </b>
          </div>
        </div>
        <div className={styles["user__orders"]}>
          <Link to="/profile/orders">My orders</Link>
          {status === Status.ERROR ? (
            <MessageBox
              message="An error occurred while loading orders, we are working on it"
              type={MessageTypes.DANGER}
              customStyles={{ marginTop: "1rem" }}
            />
          ) : status === Status.LOADING ? (
            <Skeleton height={100} count={3} style={{ marginBlock: ".7rem" }} />
          ) : (lastOrders?.length ?? 0) <= 0 ? (
            <MessageBox
              message="You dont have orders yet"
              type={MessageTypes.INFO}
              customStyles={{ marginTop: "1rem" }}
            />
          ) : (
            lastOrders &&
            lastOrders.map((item) => (
              <UserOrder
                key={item._id}
                status={item.status}
                id={item._id}
                date={item.date}
              />
            ))
          )}
        </div>
        <div className={styles["user__wishlist"]}>
          <Link to="/profile/wishlist">My wishlist</Link>
          <div className={styles["wishlist__wrapper"]}>
            {wishlistStatus === Status.ERROR ? (
              <MessageBox
                message="An error occurred while loading games, we are working on it"
                type={MessageTypes.DANGER}
                customStyles={{ marginTop: "1rem" }}
              />
            ) : wishlistStatus === Status.LOADING ? (
              <GameCardSkeleton items={4} />
            ) : items.length <= 0 ? (
              <MessageBox
                message="Your wishlist is empty"
                type={MessageTypes.INFO}
                customStyles={{ marginTop: "1rem" }}
              />
            ) : (
              items
                .slice(0, 4)
                .map((item) => (
                  <GameCard
                    key={item._id}
                    game={item}
                    isDiscount={item.discount ? true : false}
                    discount={item.discount}
                  />
                ))
            )}
          </div>
        </div>
        {/* <div className={styles["user__events"]}>
          <Link to="/profile/events">My events</Link>
          <UserEvent />
          <UserEvent />
          <UserEvent />
        </div> */}
      </section>
    </Layout>
  );
};

export default ProfilePage;
