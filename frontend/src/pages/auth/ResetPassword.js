import styles from "./auth.module.scss";
import { MdPassword } from "react-icons/md";
import Card from "../../components/card/Card";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/authService";

const initialState = {
  password: "",
  password2: "",
};

export default function ResetPassword() {
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;
  const { resetToken } = useParams();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function changePassword(e) {
    e.preventDefault();
    // console.log(formData);
    // console.log(resetToken);
    if (password.length < 6) {
      return toast.error("Password must have at least 6 characters!");
    }
    if (password !== password2) {
      return toast.error("Passwords do not match!");
    }

    const userData = { password2, password };

    try {
      const data = await resetPassword(userData, resetToken);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>
          <form onSubmit={changePassword}>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="New Password"
              required
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password2"
              value={password2}
              placeholder="Confirm New Password"
              required
              onChange={handleInputChange}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Reset Password
            </button>
            <div className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
