import { useState } from "react";
import Layout from "../../components/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/user/slice";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { setWishlist } from "../../redux/wishlist/slice";

const LoginPage: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redicretUrl = new URLSearchParams(search).get("redirect");
  const redirect = redicretUrl ? redicretUrl : "/";

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      const wishlist = await axios.get("/api/wishlist/", {
        params: { userId: data._id },
        headers: { Authorization: `Bearer ${data.token}` },
      });
      dispatch(login(data));
      dispatch(setWishlist(wishlist.data));
      dispatch(
        showToast({
          toastText: "You have successfully logged in",
          toastType: toastStatus.SUCCESS,
        })
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("userWishlist", JSON.stringify(wishlist.data));
      navigate(redirect || "/");
    } catch (err: any) {
      dispatch(
        showToast({
          toastText: err.response?.data.message || "Error while login",
          toastType: toastStatus.ERROR,
        })
      );
    }
  };
  return (
    <Layout>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className={styles["login"]}>
        <div className={styles["login__wrapper"]}>
          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <fieldset>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={handleEmailChange}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </fieldset>
            <div className={styles["toggle-password-btn"]}>
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide Password" : "Show Password"}
              </span>
              <br />
            </div>
            <div className={styles["forgot-password"]}>
              <Link to="/reset-password">Forgot the password?</Link>
            </div>
            <div className={styles["btn__wrapper"]}>
              <button type="submit">Login</button>
            </div>
            <p>
              Don't have an account? <Link to={"/register"}>Register</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
