import { Link } from "react-router-dom";
import styles from "./ImageText.module.scss";

type TProps = {
  img: string;
  imgAlt?: string;
  text: React.ReactNode;
  link?: string;
};

const ImageText: React.FC<TProps> = ({ img, imgAlt, text, link }) => {
  return (
    <div className={styles["image-text"]}>
      <Link to={`/catalog/?categories=%5B"${link}"%5D`}>
        <img src={img} alt={imgAlt} />
        <div>{text}</div>
      </Link>
    </div>
  );
};

export default ImageText;
