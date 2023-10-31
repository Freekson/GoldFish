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
  last,
  pathes = ["/"],
  to = ".",
}) => {
  return (
    <div>
      {items.map((item, index) => (
        <span key={index}>
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
