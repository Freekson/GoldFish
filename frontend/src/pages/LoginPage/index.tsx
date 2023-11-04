import { useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import styles from "./LoginPage.module.scss";
import { Helmet } from "react-helmet-async";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // logic for login
  };
  return (
    <Layout>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className={styles["login"]}>
        <div className={styles["login__wrapper"]}>
          <h3>Login</h3>
          <form>
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
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <Link to="/reset-password">Forgot the password?</Link>
            </fieldset>
            <div className={styles["btn__wrapper"]}>
              <button type="button" onClick={handleLogin}>
                Login
              </button>
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
