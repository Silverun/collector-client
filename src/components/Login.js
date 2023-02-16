import React, { useRef, useState } from "react";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { auth, setAuth } = useAuth();
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/user/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      console.log(result.data);
      const { accessToken, role, id, username } = result.data;
      console.log("Auth accToken: " + accessToken);
      setAuth({ accessToken, role, id, username });

      // set access token somewhere
      //let user go where they wanted to go before redirected to login
      // console.log(from + " from");
      // console.log(auth.id);
      // Try use something else later FIX NEEDED
      // setTimeout(() => {
      navigate(from, { replace: true });
      // }, 1000);
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
        Email
      </label>
      <input
        ref={emailRef}
        className="form-control mb-3"
        type="email"
        id="emailinput"
      />
      <label htmlFor="passwordinput" className="form-label">
        Password
      </label>
      <input ref={passwordRef} className="form-control mb-3" type="password" />
      <button type="submit" className="btn btn-primary mb-3">
        Login
      </button>
      {message ? alert : null}
      <div>
        No account yet?{" "}
        <Link style={{ textDecoration: "none" }} to="/register">
          Register.
        </Link>
      </div>
    </form>
  );
}
