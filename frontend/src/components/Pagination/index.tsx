import React, { useState } from "react";
import styles from "./Pagination.module.scss";

type PaginationProps = {
  pages: number;
};
const Pagination: React.FC<PaginationProps> = ({ pages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <ul className={styles.root}>
        <li
          onClick={() =>
            currentPage > 0 ? setCurrentPage(currentPage - 1) : ""
          }
        >
          <p>&#60;</p>
        </li>
        {[...new Array(pages)].map((_, number) => (
          <li
            key={number}
            className={currentPage === number ? styles.active : ""}
            onClick={() => {
              setCurrentPage(number);
            }}
          >
            <p>{number + 1}</p>
          </li>
        ))}
        <li
          onClick={() =>
            currentPage < pages - 1 ? setCurrentPage(currentPage + 1) : ""
          }
        >
          <p>&#62;</p>
        </li>
      </ul>
    </>
  );
};

export default Pagination;
