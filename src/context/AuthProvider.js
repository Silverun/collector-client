import { createContext, useState } from "react";
import { json } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  // const [persist, setPersist] = useState(
  //   JSON.parse(localStorage.getItem("persist")) || false
  // );

  const value = {
    auth,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
