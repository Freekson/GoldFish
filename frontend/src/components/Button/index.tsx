import React from "react";
import styles from "./Button.module.scss";

type TProps = {
  text: string;
  to: string;
  type?: "default" | "active" | "inactive";
};

const Button: React.FC<TProps> = ({ text, to, type = "default" }) => {
  return (
    <div
      className={
        type === "default"
          ? styles["button"]
          : type === "active"
          ? styles["active"]
          : styles["inactive"]
      }
    >
      <a href={to}>{text}</a>
    </div>
  );
};

export default Button;
