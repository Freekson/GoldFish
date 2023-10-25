import React from "react";
import styles from "./Layout.module.scss";
import Header from "../Header";
import Footer from "../Footer";

type TProps = {
  children: React.ReactNode;
};

const Layout: React.FC<TProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
