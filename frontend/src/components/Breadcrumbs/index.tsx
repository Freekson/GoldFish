import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.scss";
type TProps = {
  items?: string[];
  pathes?: string[];
  last: string;
  to?: string;
};

const Breadcrumbs: React.FC<TProps> = ({
  items = ["Home"],
  last = "Last",
  pathes = ["/"],
  to = ".",
}) => {
  return (
    <div className={styles["wrapper"]}>
      {items.map((item, index) => (
        <span key={index} className={styles.items}>
          <Link to={pathes[index]} className={styles.link}>
            {item}
          </Link>
          <span className={styles.span}>&gt;</span>
        </span>
      ))}
      <Link to={to} className={styles["link-last"]}>
        {last}
      </Link>
    </div>
  );
};

export default Breadcrumbs;
