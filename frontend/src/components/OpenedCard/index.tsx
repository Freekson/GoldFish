import React, { useState } from "react";
import styles from "./OpenedCard.module.scss";

type TProps = {
  title: string;
  description: React.ReactNode;
};

const OpenedCard: React.FC<TProps> = ({ title, description }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  return (
    <div className={styles.card} onClick={toggleDescription}>
      <div className={styles.descriptionToggle}>
        <p className={styles.title}>
          {title}
          <svg
            className={isDescriptionOpen ? styles.open : styles.closed}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path d="M5 6L10 11L15 6L17 7L10 14L3 7L5 6Z" fill="#2A2A2A" />
          </svg>
        </p>
      </div>

      <div className={isDescriptionOpen ? styles.active : styles.description}>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default OpenedCard;
