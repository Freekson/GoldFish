import React, { useEffect } from "react";
import styles from "./Layout.module.scss";
import Header from "../Header";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { toastStatus } from "../../redux/toast/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { hideToast } from "../../redux/toast/slice";

type TProps = {
  children: React.ReactNode;
};

const Layout: React.FC<TProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { toastText, toastType, showToast } = useSelector(
    (state: RootState) => state.toast
  );

  useEffect(() => {
    if (showToast) {
      let toastId: any;
      if (toastType === toastStatus.SUCCESS) {
        toastId = toast.success(toastText);
      } else if (toastType === toastStatus.ERROR) {
        toastId = toast.error(toastText);
      } else if (toastType === toastStatus.WARNING) {
        toastId = toast.warning(toastText);
      } else if (toastType === toastStatus.INFO) {
        toastId = toast.info(toastText);
      } else if (toastType === toastStatus.DEFAULT || "") {
        toastId = toast(toastText);
      }
      const timerId = setTimeout(() => {
        toast.dismiss(toastId);
        dispatch(hideToast());
      }, 5000);
      return () => clearTimeout(timerId);
    }
  }, [dispatch, showToast, toastText, toastType]);

  return (
    <div className={styles.container}>
      <Header />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
