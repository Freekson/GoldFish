import React from "react";
import Layout from "../../components/Layout";
import styles from "./NotFoundPage.module.scss";

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div>
        <h1 className={styles.header}>404 Page Not Found</h1>
        <section className={styles.error_container}>
          <span className={styles.four}>
            <span className={styles.screen_reader_text}>4</span>
          </span>
          <span className={styles.zero}>
            <span className={styles.screen_reader_text}>0</span>
          </span>
          <span className={styles.four}>
            <span className={styles.screen_reader_text}>4</span>
          </span>
        </section>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
