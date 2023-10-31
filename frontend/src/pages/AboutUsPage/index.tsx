import { Helmet } from "react-helmet-async";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./AboutUsPage.module.scss";

const AboutUsPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>About us</title>
      </Helmet>
      <Breadcrumbs last="About us" to="/about-us" />
      <h3>About us</h3>
      <section className={styles["about-us"]}>
        <div className={styles["about-us__text"]}>
          <h2>Our mission </h2>
          <p>
            The diverse and rich experience of strengthening and developing the
            structure largely determines the creation of a development model.
            Diverse and rich experience and consultation with a wide range of
            assets allows us to carry out important tasks in developing a
            personnel training system that meets pressing needs. Everyday
            practice shows that starting the daily work of forming a position
            allows you to complete important tasks in developing new proposals.
            Everyday practice shows that the further development of various
            forms of activity largely determines the creation of new proposals.
          </p>
        </div>
        <div className={styles["about-us__img"]}>
          <img src="./img/about-us-3.png" alt="about us" />
          <img src="./img/about-us-4.png" alt="about us" />
        </div>
      </section>
      <section className={styles["about-us"]}>
        <div className={styles["about-us__img"]}>
          <img src="./img/about-us-1.png" alt="about us" />
          <img src="./img/about-us-2.png" alt="about us" />
        </div>
        <div className={styles["about-us__text"]}>
          <h2>Our events</h2>
          <p>
            It should not be forgotten, however, that the strengthening and
            development of the structure is an interesting experiment in testing
            the development model. On the other hand, the implementation of
            planned targets largely determines the creation of systems of mass
            participation.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AboutUsPage;
