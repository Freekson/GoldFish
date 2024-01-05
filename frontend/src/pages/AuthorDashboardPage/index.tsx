import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";
import styles from "./AuthorDashboardPage.module.scss";
import { RootState, useAppDispatch } from "../../redux/store";
import {
  fetchArticleSummary,
  fetchCommentsSummary,
} from "../../redux/summary/slice";
import { useSelector } from "react-redux";
import Chart from "react-google-charts";
import { ThreeDots } from "react-loader-spinner";

const AuthorDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useSelector((state: RootState) => {
    return state.user;
  });
  const { articleSummary, commentsSummary } = useSelector(
    (state: RootState) => {
      return state.summary;
    }
  );

  useEffect(() => {
    dispatch(fetchArticleSummary({ token: userData?.token || "" }));
    dispatch(fetchCommentsSummary({ token: userData?.token || "" }));
  }, [dispatch, userData?.token]);
  return (
    <Layout>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Breadcrumbs
        items={["Home", "Profile"]}
        pathes={["/", "/profile"]}
        last="Dashboard"
      />
      <h3>Dashboard</h3>
      <section className={styles["total-info"]}>
        <div>
          <p>{articleSummary?.totalArticles || 0}</p>Acrticles
        </div>
        <div>
          <p>{articleSummary?.totalViews || 0}</p>Views
        </div>
        <div>
          <p>{articleSummary?.totalLikes || 0}</p>Likes
        </div>
        <div>
          <p>{articleSummary?.totalDislikes || 0}</p>Dislikes
        </div>
        <div>
          <p>
            {(commentsSummary?.totalComments || 0) +
              (commentsSummary?.totalReplies || 0)}
          </p>
          Coments
        </div>
      </section>
      <h3>Article count (by day)</h3>
      <section>
        {articleSummary ? (
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="AreaChart"
            loader={
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#fb791b"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            }
            data={
              articleSummary?.dailyArticles
                ? [
                    ["Date", "Articles"],
                    ...articleSummary.dailyArticles.map((x) => [
                      x._id,
                      x.articles,
                    ]),
                  ]
                : []
            }
          />
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
      </section>
      <h3>Comments count (by day)</h3>
      <section>
        {commentsSummary &&
        commentsSummary.commentsSummary &&
        commentsSummary.repliesSummary ? (
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="AreaChart"
            loader={
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#fb791b"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            }
            data={[
              ["Date", "Comments", "Replies"],
              ...commentsSummary.commentsSummary.map((x) => [
                x._id,
                x.comments,
                commentsSummary.repliesSummary.find((r) => r._id === x._id)
                  ?.replies || 0,
              ]),
            ]}
          />
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
      </section>
      <h3>Used tags</h3>
      <section className={styles["last-item"]}>
        {articleSummary && articleSummary.tags ? (
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="PieChart"
            loader={
              <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#fb791b"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                visible={true}
              />
            }
            data={[
              ["Tag", "Count"],
              ...articleSummary.tags.map((tag) => [tag._id, tag.count]),
            ]}
            options={{
              title: "Article Tags",
              pieHole: 0.4,
            }}
          />
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
      </section>
    </Layout>
  );
};

export default AuthorDashboardPage;
