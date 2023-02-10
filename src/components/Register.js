import React, { useRef } from "react";
import axios from "axios";
import { config } from "../config";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // console.log(username, email, password);

  const regSubmitHandler = async (e) => {
    e.preventDefault();
    await axios.post(config.backendServer + "/user/register", {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
  };

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
    </form>
  );
}
