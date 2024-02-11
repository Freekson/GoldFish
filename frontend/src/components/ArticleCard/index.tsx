import { Link } from "react-router-dom";
import { IArticle } from "../../types";
import styles from "./ArticleCard.module.scss";
import { formatDate } from "../../utils/formatDate";

type TProps = {
  article: IArticle;
};

const ArticleCard: React.FC<TProps> = ({ article }) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const newDate = new Date(article.createdAt);
  const formattedDate = formatDate(newDate);

  return (
    <div className={styles["article"]}>
      <Link to={`/blog/${article._id}`}>
        <img src={article.image ?? ""} alt={article.title} />
        <div>
          <b className={styles["title"]}>{truncateText(article.title, 35)}</b>{" "}
          <p className={styles["tags"]}>
            {truncateText(article.tags.join(", "), 40)}
          </p>
          <p className={styles["views"]}>Views: {article.views}</p>
          <p className={styles["date"]}>{formattedDate}</p>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
