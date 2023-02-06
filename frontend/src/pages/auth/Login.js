import styles from "./auth.module.scss";
import { BiLogIn } from "react-icons/bi";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  email: "",
  password: "",
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function login(e) {
    e.preventDefault();
    // console.log(formData);
    if (!email || !password) {
      return toast.error("All fields are required!");
    }
    if (!validateEmail(email)) {
      return toast.error("Please, enter a valid Email!");
    }

    const userData = { email, password };
    // console.log(userData);

    setLoading(true);

    try {
      const data = await loginUser(userData);
      // console.log(data);
      await dispatch(SET_LOGIN(true));
      await dispatch(SET_NAME(data.name));
      navigate("/dashboard");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error.message);
    }
  }

  return (
    <div className={`container ${styles.auth}`}>
      {loading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <BiLogIn size={35} color="#999" />
          </div>
          <h2>Login</h2>
          <form onSubmit={login}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleInputChange}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
          </form>
          <Link to="/forgot-password">Forgot Password</Link>
          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Don't have an account? &nbsp; </p>
            <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </div>
  );
}
