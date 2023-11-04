import styles from "./ImageText.module.scss";

type TProps = {
  img: string;
  imgAlt: string;
  text: React.ReactNode;
};

const ImageText: React.FC<TProps> = ({ img, imgAlt, text }) => {
  return (
    <div className={styles["image-text"]}>
      <img src={img} alt={imgAlt} />
      <div>{text}</div>
    </div>
  );
};

export default ImageText;
