import React from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./SettingsPage.module.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const SettingPage: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const currentExp = userData?.experience ?? 0;

  return (
    <Layout>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile"]}
        pathes={["/", "/profile"]}
        last="Settings"
      />
      <h3>Settings</h3>
      <section className={styles["settings__wrapper"]}>
        <aside className={styles["settings__aside"]}>
          <ul>
            <li>
              <Link to="./change-image">Change profile image</Link>
            </li>
            <li>
              <Link to="./change-profile-data">Change profile data</Link>
            </li>
            <li>
              <Link to="./change-password">Change password</Link>
            </li>
            <li>
              <Link to="/contact">Feedback</Link>
            </li>
          </ul>
        </aside>
        <div className={styles["settings__data"]}>
          <img
            src={userData?.image ? userData.image : "/img/user-photo.png"}
            alt="user"
          />
          <div className={styles["settings__info"]}>
            <p>
              <b>Your name:</b> {userData?.name}
            </p>
            <p>
              <b>Your Email:</b> {userData?.email}
            </p>
            <p>
              <b>Your current experience: </b>
              {userData?.experience}
            </p>
            <p>
              <b>Your rank: </b>{" "}
              {currentExp >= 10000
                ? "Professional"
                : currentExp >= 5000
                ? "Amateur"
                : currentExp >= 1000
                ? "Newbie"
                : "Buy more for opening your first rank"}
            </p>
          </div>
        </div>
        <div className={styles["settings__links"]}>
          <p>
            <Link to="/profile/orders">See my order history</Link>
          </p>
          <p>
            <Link to="/profile/events">See my events history</Link>
          </p>
          <p>
            <Link to="/profile/wishlist">See my wishlist</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default SettingPage;
