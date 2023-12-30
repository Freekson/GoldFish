import { Link } from "react-router-dom";
import styles from "./ArticlesItem.module.scss";
import { formatDate } from "../../utils/formatDate";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { IArticle } from "../../types";
import { toast } from "react-toastify";
import { fetchAuthorArticles } from "../../redux/article/slice";

type TProps = {
  article: IArticle;
};
const ArticlesItem: React.FC<TProps> = ({ article }) => {
  const dispatch = useAppDispatch();

  const newDate = new Date(article.createdAt);
  const formattedDate = formatDate(newDate);

  const { userData } = useSelector((state: RootState) => state.user);

  const deleteHandler = async () => {
    if (window.confirm("Are you sure you want to cancel the order?")) {
      try {
        await axios.delete(`/api/article/${article._id}`, {
          headers: { Authorization: `Bearer ${userData?.token}` },
        });

        toast.success("Article Deleted Successfuly");
        dispatch(fetchAuthorArticles({ token: userData?.token ?? "" }));
      } catch (err) {
        toast.error(`Error while deleting article: ${err}`);
      }
    }
  };

  return (
    <div className={styles["article"]}>
      <div className="id">
        <p>
          <b>Article Id:</b> {article._id}
        </p>
      </div>
      <div className="date">
        <p>
          <b>Date od publishing:</b> {formattedDate}
        </p>
      </div>
      <div className="rating">
        <p>
          <b>Rating:</b> Will be later...
        </p>
      </div>
      <div className="comments">
        <p>
          <b>Count of comments:</b> Will be later...
        </p>
      </div>
      <div className={styles["actions"]}>
        <Link to={`/blog/${article._id}`}>Show</Link>
        <p onClick={deleteHandler}>Delete</p>
        <Link to={`/author/update/${article._id}`}>Redact</Link>
      </div>
    </div>
  );
};

export default ArticlesItem;
