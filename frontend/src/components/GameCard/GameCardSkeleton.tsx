import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./GameCard.module.scss";
import "react-loading-skeleton/dist/skeleton.css";

type TProps = {
  items: number;
};

const GameCardSkeleton: React.FC<TProps> = ({ items }) => {
  return (
    <>
      {Array.from({ length: items }, (_, index) => (
        <div className={styles.card} key={index}>
          <div style={{ width: "90%" }}>
            <Skeleton height={150} />
          </div>

          <div style={{ marginTop: "1rem", width: "90%" }}>
            <Skeleton />
          </div>
          <div style={{ marginTop: "1rem", width: "90%", display: "flex" }}>
            <Skeleton height={30} />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Skeleton height={50} style={{ marginTop: "2rem" }} />
            <Skeleton height={30} style={{ marginTop: "1rem" }} />
          </div>
        </div>
      ))}
    </>
  );
};

export default GameCardSkeleton;
