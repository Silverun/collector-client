import React, { useRef, useState } from "react";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setAuth } = useAuth();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("login");
  const from = location.state?.from?.pathname || "/";

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/user/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      const { accessToken, role, id, username } = result.data;
      setAuth({ accessToken, role, id, username });
      navigate(from, { replace: true });
    } catch (error) {
      setMessage(error.response?.data || error.message);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const alert = (
    <div className="alert alert-warning mt-3" role="alert">
      {message}
    </div>
  );

  return (
    <form
      onSubmit={loginSubmitHandler}
      className="container text-center"
      style={{ maxWidth: 400 }}
    >
      <label htmlFor="emailinput" className="form-label">
        {t("email")}
      </label>
      <input
        ref={emailRef}
        className="form-control mb-3"
        type="email"
        id="emailinput"
      />
      <label htmlFor="passwordinput" className="form-label">
        {t("password")}
      </label>
      <input ref={passwordRef} className="form-control mb-3" type="password" />
      <button type="submit" className="btn btn-primary mb-3">
        {t("loginbutton")}
      </button>
      {message ? alert : null}
      <div>
        <p>{t("noacc")}</p>
        <Link style={{ textDecoration: "none" }} to="/register">
          {t("register")}
        </Link>
      </div>
    </form>
  );
}
