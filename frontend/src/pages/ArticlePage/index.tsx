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

const ArticlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { article, status } = useSelector((state: RootState) => state.article);

  useEffect(() => {
    const fetchData = async () => {
      id && dispatch(fetchArticle({ id }));
    };
    fetchData();
  }, [dispatch, id]);

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
      <h3>{article?.title || <Skeleton width={200} />}</h3>
      <div className={styles["article__wrapper"]}>
        <section className={styles["article__content"]}>
          {status === Status.ERROR && (
            <MessageBox
              message="Article nor found 😕"
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
        </section>
        <aside className={styles["article__aside"]}>
          {status === Status.LOADING ? (
            <Skeleton height={150} />
          ) : status === Status.SUCCESS ? (
            <>
              <p>Author: {article?.author.name}</p>
              <p>
                Publish time: {formatDate(new Date(article?.createdAt || ""))}
              </p>
              <p>
                Last redacted at:{" "}
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
            </>
          ) : (
            ""
          )}
        </aside>
      </div>
    </Layout>
  );
};

export default ArticlePage;
