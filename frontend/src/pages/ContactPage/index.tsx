import React from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ContactPage.module.scss";

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Contact us</title>
      </Helmet>
      <Breadcrumbs last="Contact" />
      <h3>Contact us</h3>
      <section className={styles["contact__wrapper"]}>
        <form
          action="/handling-form-page"
          method="post"
          className={styles["contact__form"]}
        >
          <fieldset className={styles["contact__fieldset"]}>
            <label htmlFor="name" className={styles["contact__label"]}>
              Your name:
            </label>{" "}
            <br />
            <input
              className={styles["contact__input"]}
              type="text"
              id="name"
              name="user_name"
              placeholder="Name"
              required
            />
          </fieldset>
          <fieldset className={styles["contact__fieldset"]}>
            <label htmlFor="telephone">Telephone:</label> <br />
            <input
              className={styles["contact__input"]}
              type="tel"
              id="telephone"
              name="user_telephone"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="___-___-____"
              required
            />
          </fieldset>
          <fieldset className={styles["contact__fieldset"]}>
            <label htmlFor="comment">Your comment:</label> <br />
            <textarea
              className={styles["contact__textarea"]}
              id="comment"
              name="user_comment"
              rows={4}
              cols={50}
              placeholder="Comment"
            ></textarea>
          </fieldset>
          <input
            className={styles["contact__btn"]}
            type="submit"
            value="Send Feedback"
            formMethod="post"
          />
        </form>
      </section>
    </Layout>
  );
};

export default ContactPage;
