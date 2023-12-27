import React, { ChangeEvent, FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ChangePasswordPage.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { validatePassword } from "../../utils/validatePassword";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePasswordPage: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCurrentPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(event.target.value);
  };
  const handleNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };
  const handleConfirmPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const onClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validatePassword(newPassword, confirmPassword);

    if (isValid) {
      try {
        await axios.put(
          "/api/users/update-password",
          { currentPassword, newPassword },
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          }
        );
        toast.success("Password changed successfully");
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
      } catch (err: any) {
        toast.error(
          err.response?.data.message || "Error while changing password"
        );
      }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Change password</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile", "Settings"]}
        pathes={["/", "/profile", "/profile/settings"]}
        last={"Change password"}
      />
      <h3>Change password</h3>
      <section className={styles["form__wrapper"]}>
        <form
          action="/handling-form-page"
          method="post"
          className={styles["form__form"]}
          onSubmit={onClickSubmit}
        >
          <fieldset className={styles["form__fieldset"]}>
            <label htmlFor="name" className={styles["form__label"]}>
              Сurrent password:
            </label>{" "}
            <br />
            <input
              className={styles["form__input"]}
              type="password"
              name="password"
              required
              value={currentPassword}
              onChange={handleCurrentPassword}
            />
          </fieldset>
          <fieldset className={styles["form__fieldset"]}>
            <label htmlFor="telephone">New password:</label> <br />
            <input
              className={styles["form__input"]}
              type="password"
              name="password"
              required
              value={newPassword}
              onChange={handleNewPassword}
            />
          </fieldset>
          <fieldset className={styles["form__fieldset"]}>
            <label htmlFor="telephone">Confirm password:</label> <br />
            <input
              className={styles["form__input"]}
              type="password"
              name="password"
              required
              value={confirmPassword}
              onChange={handleConfirmPassword}
            />
          </fieldset>
          <input
            className={styles["form__btn"]}
            type="submit"
            value="Change password"
            formMethod="post"
          />
        </form>
      </section>
    </Layout>
  );
};

export default ChangePasswordPage;
