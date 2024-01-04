import React, { FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./ChangeImagePage.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const ChangeImagePage: React.FC = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");

  const uploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      try {
        setIsLoading(true);
        const { data } = await axios.post("/api/upload/image", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        setIsLoading(false);
        setImage(data.secure_url);
        toast.success("Image uploaded successfuly");
      } catch (err) {
        setIsLoading(false);
        toast.error(`Error while loading image: ${err}`);
      }
    }
  };
  const onClickSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image === "") {
      toast.warning("You didn't upload the image");
    } else {
      try {
        await axios.put(
          "/api/users/update-image",
          { imageUrl: image },
          {
            headers: { Authorization: `Bearer ${userData?.token}` },
          }
        );
        toast.success("Image changed successfully");
        setImage("");
      } catch (err: any) {
        toast.error(err.response?.data.message || "Error while updating image");
      }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Change profile image</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile", "Settings"]}
        pathes={["/", "/profile", "/profile/settings"]}
        last={"Change image"}
      />
      <h3>Change profile image</h3>
      <section className={styles["form__wrapper"]}>
        <form
          action="/handling-form-page"
          method="post"
          className={styles["form__form"]}
          onSubmit={onClickSubmit}
        >
          <fieldset className={styles["form__fieldset"]}>
            <label htmlFor="name" className={styles["form__label"]}>
              Upload image:
            </label>{" "}
            <br />
            <input
              className={styles["form__input"]}
              type="file"
              name="image"
              required
              onChange={uploadHandler}
            />
            {isLoading && (
              <div className={styles["loading-box"]}>
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#fb791b"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  visible={true}
                />
              </div>
            )}
          </fieldset>

          <input
            className={styles["form__btn"]}
            type="submit"
            value="Change image"
            formMethod="post"
            disabled={isLoading}
          />
        </form>
      </section>
    </Layout>
  );
};

export default ChangeImagePage;
