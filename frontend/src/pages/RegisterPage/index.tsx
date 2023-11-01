import { useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { Helmet } from "react-helmet-async";

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(event.target.value);
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

  const handleRegister = () => {
    //chech passwords
    if (password === confirmPassword) {
      //post request
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
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
          <form>
            <fieldset>
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={handleFullNameChange}
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
            </fieldset>
            <fieldset>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </fieldset>
            {!passwordsMatch && (
              <p className={styles["message"]}>Passwords do not match.</p>
            )}
            <div className={styles["btn__wrapper"]}>
              <button type="button" onClick={handleRegister}>
                Register
              </button>
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
