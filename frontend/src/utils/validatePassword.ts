import { toast } from "react-toastify";

export const validatePassword = (password: string, confirmPassword: string) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (password !== confirmPassword) {
    toast.warning("Passwords do not match");
    return false;
  }

  if (password.length < minLength) {
    toast.warning("Password must be at least 6 characters long");
    return false;
  }

  if (!hasUpperCase || !hasLowerCase || !hasDigit) {
    toast.warning(
      "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    );
    return false;
  }

  return true;
};
