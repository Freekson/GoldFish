import React, { ChangeEvent, FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ChangeProfileDataPage.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import axios from "axios";

const ChangeProfileDataPage: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(userData?.name);
  const [email, setEmail] = useState(userData?.email);

  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onSubmitName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/users/update-name",
        { newName: name },
        {
          headers: { Authorization: `Bearer ${userData?.token}` },
        }
      );
      toast.success("Name changed successfully");
      setName("");
    } catch (err: any) {
      toast.error(err.response?.data.message || "Error while changing name");
    }
  };
  const onSubmitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/users/update-email",
        { newEmail: email },
        {
          headers: { Authorization: `Bearer ${userData?.token}` },
        }
      );
      toast.success("Email changed successfully");
      setEmail("");
    } catch (err: any) {
      toast.error(err.response?.data.message || "Error while changing email");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Change profile data</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile", "Settings"]}
        pathes={["/", "/profile", "/profile/settings"]}
        last={"Change profile data"}
      />
      <h3>Change profile data</h3>
      <section className={styles["form__wrapper"]}>
        <form
          action="/handling-form-page"
          method="post"
          className={styles["form__form"]}
          onSubmit={onSubmitName}
        >
          <fieldset className={styles["form__fieldset"]}>
            <label htmlFor="name" className={styles["form__label"]}>
              New name:
            </label>{" "}
            <br />
            <input
              className={styles["form__input"]}
              type="text"
              name="name"
              required
              value={name}
              onChange={handleName}
            />
          </fieldset>
          <input
            className={styles["form__btn"]}
            type="submit"
            value="Change name"
            formMethod="post"
          />
        </form>
        <form
          action="/handling-form-page"
          method="post"
          className={styles["form__form"]}
          onSubmit={onSubmitEmail}
        >
          <fieldset className={styles["form__fieldset"]}>
            <label htmlFor="telephone">New email:</label> <br />
            <input
              className={styles["form__input"]}
              type="email"
              name="email"
              required
              value={email}
              onChange={handleEmail}
            />
          </fieldset>
          <input
            className={styles["form__btn"]}
            type="submit"
            value="Change email"
            formMethod="post"
          />
        </form>
      </section>
    </Layout>
  );
};

export default ChangeProfileDataPage;
