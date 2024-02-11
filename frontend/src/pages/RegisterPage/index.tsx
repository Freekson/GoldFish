import { useState } from "react";
import Layout from "../../components/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/user/slice";
import { showToast } from "../../redux/toast/slice";
import { toastStatus } from "../../redux/toast/types";
import { validatePassword } from "../../utils/validatePassword";

const RegisterPage: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [userLogin, setUserLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redicretUrl = new URLSearchParams(search).get("redirect");
  const redirect = redicretUrl ? redicretUrl : "/";

  const handleUserLoginChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUserLogin(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validatePassword(password, confirmPassword);

    if (isValid) {
      try {
        const { data } = await axios.post("/api/users/register", {
          name: userLogin,
          email,
          password,
        });
        dispatch(login(data));
        dispatch(
          showToast({
            toastText: "Account created successfully",
            toastType: toastStatus.SUCCESS,
          })
        );

        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate(redirect || "/");
      } catch (err: any) {
        dispatch(
          showToast({
            toastText: err.response?.data.message || "Error while registering",
            toastType: toastStatus.WARNING,
          })
        );
      }
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Regiser</title>
      </Helmet>
      <div className={styles["register"]}>
        <div className={styles["register__wrapper"]}>
          <h3>Register</h3>
          <form onSubmit={handleRegister}>
            <fieldset>
              <label htmlFor="fullName">Login:</label>
              <input
                type="text"
                id="login"
                placeholder="Login"
                value={userLogin}
                onChange={handleUserLoginChange}
                required
              />
            </fieldset>
            <fieldset>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                value={email}
                onChange={handleEmailChange}
                required
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
                required
              />
            </fieldset>
            <fieldset>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </fieldset>
            <div className={styles["toggle-password-btn"]}>
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide Password" : "Show Password"}
              </span>
            </div>
            <div className={styles["btn__wrapper"]}>
              <button type="submit">Register</button>
            </div>
            <p>
              Do you have an account? <Link to={"/login"}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
