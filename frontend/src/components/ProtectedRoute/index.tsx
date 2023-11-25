import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../redux/store";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { fetchUser } from "../../redux/user/slice";
import { TUser } from "../../types";
import { ThreeDots } from "react-loader-spinner";
import styles from "./ProtectedRoute.module.scss";

type TProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<TProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const data = localStorage.getItem("userInfo");
  const userLS: TUser | null = data ? JSON.parse(data) : null;

  useEffect(() => {
    dispatch(fetchUser({ token: userLS?.token ?? "" }));
  }, [dispatch, userLS?.token]);

  const { userData, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (status === "loading") {
    } else if (status === "success" && userData) {
    } else if (status === "error" || !userData) {
      dispatch(
        showToast({
          toastText: "You must be logged in to visit this route",
          toastType: toastStatus.ERROR,
        })
      );
    }
  }, [dispatch, status, userData]);

  if (status === "loading") {
    return (
      <div className={styles["loading"]}>
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#fb791b"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
        />
      </div>
    );
  }

  return userData ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
