import React, { useContext, useRef, useState } from "react";
import axios from "../api/axios";
// import { config } from "../config";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setAuth } = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/user/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      console.log(result.data);
      const { accessToken, role, id, username } = result.data;
      setAuth({ accessToken, role, id, username });
      // set access token somewhere
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
