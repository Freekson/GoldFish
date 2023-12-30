import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import { SimpleMdeReact } from "react-simplemde-editor";
import styles from "./UpdateArticlePage.module.scss";
import "easymde/dist/easymde.min.css";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArticle } from "../../redux/article/slice";
import { Status } from "../../types";
import Skeleton from "react-loading-skeleton";
import MessageBox, { MessageTypes } from "../../components/MessageBox";

const UpdateArticlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useSelector((state: RootState) => state.user);
  const { article, status } = useSelector((state: RootState) => state.article);

  const [content, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
        uniqueId: "text",
      },
    }),
    []
  );

  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      id && (await dispatch(fetchArticle({ id })));
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (status === Status.SUCCESS) {
      setValue(article?.content || "");
      setImage(article?.image || "");
      setTags(article?.tags.join("; ") || "");
      setTitle(article?.title || "");
    }
  }, [article, status]);

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleTags = (event: ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value);
  };

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

    try {
      await axios.put(
        `/api/article/${article?._id}`,
        {
          title: title,
          content: content,
          image: image,
          tags: tags
            .split(";")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
        },
        {
          headers: { Authorization: `Bearer ${userData?.token}` },
        }
      );
      dispatch(
        showToast({
          toastText: "Article updated",
          toastType: toastStatus.SUCCESS,
        })
      );
      navigate(`/blog/${article?._id}`);
    } catch (err: any) {
      toast.error(err.response?.data.message || "Error while updating article");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Article editing</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile", "Article management"]}
        pathes={["/", "/profile", "/author/management"]}
        last="Edit"
      />
      <h3>Article editing</h3>
      <section className={styles["form__wrapper"]}>
        {status === Status.LOADING ? (
          <div style={{ width: "100%" }}>
            <Skeleton height={600} />
          </div>
        ) : (
          <form
            action="/handling-form-page"
            method="post"
            className={styles["form__form"]}
            onSubmit={onClickSubmit}
          >
            <fieldset className={styles["form__fieldset"]}>
              <label htmlFor="image" className={styles["form__label"]}>
                Upload preview if you want to change it:
              </label>{" "}
              <br />
              <input
                className={styles["form__input"]}
                type="file"
                name="image"
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
            <fieldset className={styles["form__fieldset"]}>
              <label htmlFor="title" className={styles["form__label"]}>
                Title*:
              </label>{" "}
              <br />
              <input
                className={styles["form__input"]}
                type="text"
                name="title"
                required
                value={title}
                onChange={handleTitle}
              />
            </fieldset>
            <fieldset className={styles["form__fieldset"]}>
              <label htmlFor="tags" className={styles["form__label"]}>
                Tags (separated by ;)
              </label>{" "}
              <br />
              <input
                className={styles["form__input"]}
                type="text"
                name="tags"
                required
                value={tags}
                onChange={handleTags}
              />
            </fieldset>
            <fieldset className={styles["form__fieldset"]}>
              <label htmlFor="tags" className={styles["form__label"]}>
                Content*:
              </label>{" "}
              <SimpleMdeReact
                className={styles.editor}
                value={content}
                onChange={onChange}
                options={options}
              />
            </fieldset>

            <input
              className={styles["form__btn"]}
              type="submit"
              value="Update article"
              formMethod="post"
              disabled={isLoading}
            />
          </form>
        )}
        {status === Status.ERROR && (
          <MessageBox
            message="An error occurred while loading article, we are working on it"
            type={MessageTypes.DANGER}
            customStyles={{ marginTop: "1rem" }}
          />
        )}
      </section>
    </Layout>
  );
};

export default UpdateArticlePage;
