import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Register() {
  const [message, setMessage] = useState(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const regSubmitHandler = async (e) => {
    e.preventDefault();
    await axios
      .post("/user/register", {
        username: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setMessage(err.response.data);
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      });
  };

  const alert = (
    <div className="alert alert-warning mt-3" role="alert">
      {message}
    </div>
  );

  return (
    <form
      onSubmit={regSubmitHandler}
      className="container text-center"
      style={{ maxWidth: 400 }}
    >
      <label htmlFor="nameinput" className="form-label">
        Your Name
      </label>
      <input
        type="text"
        ref={nameRef}
        className="form-control mb-3"
        id="nameinput"
      />
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
      <button type="submit" className="btn btn-primary">
        Register
      </button>
      {message ? alert : null}
    </form>
  );
}
