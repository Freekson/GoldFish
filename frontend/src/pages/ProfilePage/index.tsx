import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ProfilePage.module.scss";
import UserEvent from "../../components/UserEvent";
import UserOrder from "../../components/UserOrder";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const ProfilePage: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);
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
                {userData?.isAdmin
                  ? "Admin"
                    ? userData?.isAuthor
                    : "Author"
                  : "Standart User"}
              </span>
            </p>
          </div>
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
          <UserOrder />
          <UserOrder />
          <UserOrder />
        </div>
        <div className={styles["user__events"]}>
          <Link to="/profile/events">My events</Link>
          <UserEvent />
          <UserEvent />
          <UserEvent />
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;
