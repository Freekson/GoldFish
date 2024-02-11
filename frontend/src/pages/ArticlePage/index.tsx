import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useParams } from "react-router-dom";
import { fetchArticle } from "../../redux/article/slice";
import { RootState, useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/formatDate";
import { Status } from "../../types";
import styles from "./ArticlePage.module.scss";
import Skeleton from "react-loading-skeleton";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-toastify";
import axios from "axios";
import WriteComment from "../../components/WriteComment";
import Comment from "../../components/Comment";
import { fetchComments } from "../../redux/comment/slice";

const ArticlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { article, status } = useSelector((state: RootState) => state.article);
  const { comments, status: commentStatus } = useSelector(
    (state: RootState) => state.comment
  );

  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      id && dispatch(fetchArticle({ id }));
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    const fetchData = async () => {
      id && dispatch(fetchComments({ id }));
    };
    fetchData();
  }, [dispatch, id]);

  const handleLike = async () => {
    if (userData) {
      if (!article?.likedBy.some((id) => id === userData?._id)) {
        try {
          await axios.post(
            `/api/article/like/${article?._id}`,
            { userId: userData._id },
            {
              headers: {
                Authorization: `Bearer ${userData?.token}`,
              },
            }
          );
          toast.success("You liked this article");
          dispatch(fetchArticle({ id: article?._id || "" }));
        } catch (err: any) {
          toast.error(err.response?.data.message || "An error occurred");
        }
      } else {
        toast.info("You liked this article before");
      }
    } else {
      toast.info("You need to be logged in, to do this");
    }
  };

  const handleDislike = async () => {
    if (userData) {
      if (!article?.dislikedBy.some((id) => id === userData?._id)) {
        try {
          await axios.post(
            `/api/article/dislike/${article?._id}`,
            { userId: userData._id },
            {
              headers: {
                Authorization: `Bearer ${userData?.token}`,
              },
            }
          );
          toast.success("You disliked this article");
          dispatch(fetchArticle({ id: article?._id || "" }));
        } catch (err: any) {
          toast.error(err.response?.data.message || "An error occurred");
        }
      } else {
        toast.info("You disliked this article before");
      }
    } else {
      toast.info("You need to be logged in, to do this");
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{article?.title}</title>
      </Helmet>

      {status === Status.LOADING ? (
        <div style={{ width: "20%" }}>
          <Skeleton height={20} />
        </div>
      ) : (
        <Breadcrumbs
          items={["Home", "Blog"]}
          pathes={["/", "/blog"]}
          last={article?.title || "Article"}
        />
      )}
      <h3>
        {status === Status.LOADING ? (
          <Skeleton width={200} />
        ) : status === Status.ERROR ? (
          "Article"
        ) : (
          article?.title
        )}
      </h3>
      <div className={styles["article__wrapper"]}>
        <section className={styles["article__content"]}>
          {status === Status.ERROR && (
            <MessageBox
              message="Article not found 😕"
              type={MessageTypes.DANGER}
              customStyles={{ marginTop: "1rem" }}
            />
          )}
          {status === Status.LOADING ? (
            <Skeleton height={400} style={{ marginBottom: "1rem" }} />
          ) : (
            article?.image && <img src={article?.image || ""} alt="Preview" />
          )}
          {status === Status.LOADING ? (
            <Skeleton height={200} />
          ) : (
            <Markdown remarkPlugins={[remarkGfm]}>{article?.content}</Markdown>
          )}
          {status === Status.LOADING ? (
            <Skeleton height={300} style={{ marginTop: "4rem" }} />
          ) : (
            <WriteComment />
          )}
          {commentStatus === Status.LOADING ? (
            <Skeleton height={300} style={{ marginTop: "5rem" }} />
          ) : commentStatus === Status.SUCCESS ? (
            (comments?.length || 0) > 0 && (
              <>
                <h3>Comments</h3>
                {comments?.map((com) => (
                  <div key={com._id} style={{ margin: "2rem 0" }}>
                    <Comment comment={com} />
                    {com.replies && com.replies.length > 0 && (
                      <>
                        {com.replies.map((reply) => (
                          <Comment
                            isCommentReply
                            comment={reply}
                            parentComment={com._id}
                            key={reply._id}
                          />
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </>
            )
          ) : (
            <MessageBox
              message="We can't fetch comments for this article 😕"
              type={MessageTypes.DANGER}
              customStyles={{ marginTop: "1rem" }}
            />
          )}
        </section>
        {status !== Status.ERROR && (
          <aside className={styles["article__aside"]}>
            {status === Status.LOADING ? (
              <Skeleton height={150} />
            ) : status === Status.SUCCESS ? (
              <>
                <img
                  src={`${article?.author.image || "/img/user-photo.png"}`}
                  alt="user"
                  className={styles["user-image"]}
                />
                <p>
                  <b>Author:</b> {article?.author.name}
                </p>
                <p>
                  <b>Article rating:</b>{" "}
                  {(article?.likedBy.length || 0) -
                    (article?.dislikedBy.length || 0)}
                </p>
                {article?.tags && (
                  <div>
                    <b>Tags:</b> {article.tags.map((item) => item + " ")}
                  </div>
                )}
                <p>
                  <b>Publish time:</b>{" "}
                  {formatDate(new Date(article?.createdAt || ""))}
                </p>
                <p>
                  <b>Last redacted at:</b>{" "}
                  {formatDate(new Date(article?.updatedAt || ""))}
                </p>
                <p className={styles["article__views"]}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="18"
                    viewBox="0 0 576 512"
                  >
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                  </svg>
                  {article?.views}
                </p>
                <p className={styles["article__rating"]}>
                  <span onClick={handleLike}>
                    <b>{article?.likedBy.length}</b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                    </svg>
                  </span>
                  <span onClick={handleDislike}>
                    <b>{article?.dislikedBy.length}</b>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
                    </svg>
                  </span>
                </p>
              </>
            ) : (
              ""
            )}
          </aside>
        )}
      </div>
    </Layout>
  );
};

export default ArticlePage;
