import React from "react";
import styles from "./Button.module.scss";

type TProps = {
  text: string;
  to: string;
};

const Button: React.FC<TProps> = ({ text, to }) => {
  return (
    <div className={styles.button}>
      <a href={to}>{text}</a>
    </div>
  );
};

export default Button;
