import React, { CSSProperties } from "react";
import styles from "./MessageBox.module.scss";

export enum MessageTypes {
  DANGER = "danger",
  INFO = "info",
  WARNING = "warning",
}
interface IMessageProps {
  message: React.ReactNode;
  type: MessageTypes;
  customStyles?: CSSProperties;
}

const MessageBox: React.FC<IMessageProps> = ({
  message,
  type,
  customStyles,
}) => {
  return (
    <div
      className={`${styles["message-box"]} ${styles[type]}`}
      style={customStyles}
    >
      {message}
    </div>
  );
};

export default MessageBox;
