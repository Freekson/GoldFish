import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { fetchAuthorArticles } from "../../redux/article/slice";
import MessageBox, { MessageTypes } from "../../components/MessageBox";
import { Status } from "../../types";
import Skeleton from "react-loading-skeleton";
import ArticlesItem from "../../components/ArticlesItem";
import { Link } from "react-router-dom";
import styles from "./ManageArticlePage.module.scss";

const ManageArticlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { articles, statusAll } = useSelector(
    (state: RootState) => state.article
  );
  useEffect(() => {
    dispatch(fetchAuthorArticles({ token: userData?.token ?? "" }));
  }, [dispatch, userData?.token]);

  return (
    <Layout>
      <Helmet>
        <title>Article management</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile"]}
        pathes={["/", "/profile"]}
        last={"Article management"}
      />
      <h3>Article management</h3>
      <section className={styles["article__wrapper"]}>
        {statusAll === Status.ERROR ? (
          <MessageBox
            message="An error occurred while loading articles, we are working on it"
            type={MessageTypes.DANGER}
            customStyles={{ marginTop: "1rem" }}
          />
        ) : statusAll === Status.LOADING ? (
          <Skeleton height={100} count={3} style={{ marginBlock: ".7rem" }} />
        ) : (articles?.length ?? 0) <= 0 ? (
          <MessageBox
            message={
              <>
                You dont have articles yet <br />{" "}
                <Link to="/author/create">Write your first article</Link>{" "}
              </>
            }
            type={MessageTypes.INFO}
            customStyles={{ marginTop: "1rem" }}
          />
        ) : (
          articles &&
          articles.map((item) => <ArticlesItem article={item} key={item._id} />)
        )}
      </section>
    </Layout>
  );
};

export default ManageArticlePage;
