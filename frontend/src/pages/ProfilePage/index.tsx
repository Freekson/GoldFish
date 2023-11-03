import React from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ProfilePage.module.scss";
import UserEvent from "../../components/UserEvent";
import UserOrder from "../../components/UserOrder";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
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
            <img src="/img/user-1.png" alt="user" />
            <b>John Smith</b>
          </div>
          <div>
            <p className={styles["user__status"]}>
              Status: <span>Standart User</span>
            </p>
          </div>
        </div>
        <div className={styles["user__achievements"]}>
          <h4>Loyalty card</h4>
          <div className={styles["card"]}>
            <img src="/img/card-1.png" alt="card" />
            <div className={styles["achievements"]}>
              <div className={styles["achievements__item"]}>
                <div>
                  <img src="/img/achievement-1.png" alt="achievements" />
                </div>
                <p className={styles["name"]}>
                  5% "Newbie" <br />
                  <span> Received</span>
                </p>
                <b>1000</b>
              </div>
              <div className={styles["achievements__item"]}>
                <div>
                  <img src="/img/achievement-2.png" alt="achievements" />
                </div>
                <p className={styles["name"]}>
                  10% "Amateur" <br />
                  <span> In progress</span>
                </p>
                <b>5000</b>
              </div>
              <div className={styles["achievements__item"]}>
                <div>
                  <img src="/img/achievement-3.png" alt="achievements" />
                </div>
                <p className={styles["name"]}>
                  15% "Professional" <br />
                  <span>Closed</span>
                </p>
                <b>10000</b>
              </div>
            </div>
          </div>
          <div className={styles["progress"]}>
            <progress id="myProgressBar" value="20" max="100"></progress>
            <b>1200/5000</b>
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
