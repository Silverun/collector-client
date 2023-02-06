import React, { useRef } from "react";
import axios from "axios";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  // console.log(username, email, password);

  const regSubmitHandler = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/user/register", {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
  };

  return (
    <form
      onSubmit={regSubmitHandler}
      className="container"
      style={{ maxWidth: 400 }}
    >
      <input type="text" ref={nameRef} className="mb-4" label="Your name" />
      <input
        ref={emailRef}
        className="mb-4"
        type="email"
        label="Email address"
      />
      <input
        ref={passwordRef}
        className="mb-4"
        type="password"
        label="Password"
      />
      <button type="submit" className="mb-4">
        Register
      </button>
    </form>
  );
}
