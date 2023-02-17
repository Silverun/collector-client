import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import logo from "../img/cltr_logo_100.png";

const Navigation = () => {
  const [hamButton, setHamButton] = useState(true);
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  // const { setAuth } = useAuth();

  const hamburgerButtonToggler = () => {
    if (hamButton === true) {
      setHamButton(false);
    } else {
      setHamButton(true);
    }
  };

  const logoutButtonHandler = async () => {
    try {
      await logout();
      navigate("/login");
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar navbar-expand-sm bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img
            style={{ minHeight: 40, minWidth: 40 }}
            className="img-fluid"
            src={logo}
            alt="col_logo"
          />
        </NavLink>
        <button
          onClick={hamburgerButtonToggler}
          className={hamButton ? "navbar-toggler" : "navbar-toggler collapsed"}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded={hamButton ? "false" : "true"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={
            hamButton
              ? "navbar-collapse collapse"
              : "navbar-collapse collapse show"
          }
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav  me-auto mb-2 mb-lg-0">
            {auth.role ? (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  aria-current="page"
                  to="/user/1"
                >
                  My collections
                </NavLink>
              </li>
            ) : null}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/login"
              >
                Login
              </NavLink>
            </li>
            {auth.role === 2 ? (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  to="/admin"
                >
                  Admin dashboard
                </NavLink>
              </li>
            ) : null}
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

          {auth.role ? (
            <button
              onClick={logoutButtonHandler}
              className="btn btn-outline-success ms-2"
              type="button"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
