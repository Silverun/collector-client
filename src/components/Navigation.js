import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import logo from "../img/cltr_logo_100.png";
import MiniSearch from "minisearch";
import ListGroup from "react-bootstrap/ListGroup";

const Navigation = () => {
  const [hamButton, setHamButton] = useState(true);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const searchRef = useRef();

  const documents = [
    {
      id: 1,
      title: "Moby Dick",
      text: "Call me Ishmael. Some years ago...",
      category: "fiction",
    },
    {
      id: 2,
      title: "Zen and the Art of Motorcycle Maintenance",
      text: "I can see by my watch...",
      category: "fiction",
    },
    {
      id: 3,
      title: "Neuromancer",
      text: "The sky above the port was...",
      category: "fiction",
    },
    {
      id: 4,
      title: "Zen and the Art of Archery",
      text: "At first sight it must seem...",
      category: "non-fiction",
    },
    // ...and more
  ];

  let miniSearch = new MiniSearch({
    fields: ["title", "text"], // fields to index for full-text search
    storeFields: ["title", "category"], // fields to return with search results
  });

  // Index all documents
  miniSearch.addAll(documents);

  const searchHandler = (e) => {
    e.preventDefault();
    const results = miniSearch.search(searchRef.current.value);
    console.log("search results", results);
    setSearchResult(results);
  };

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

  const searchResultsList = (
    <ListGroup>
      {searchResult.map((item) => (
        <ListGroup.Item key={item.id}>Cras justo odio</ListGroup.Item>
      ))}
    </ListGroup>
  );

  return (
    <nav className="navbar navbar-expand-sm shadow-sm bg-body-tertiary">
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
                  to={`/user/${auth.id}`}
                >
                  {auth.username}'s collections
                </NavLink>
              </li>
            ) : null}
            {auth.role ? null : (
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
            )}
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
              ref={searchRef}
              placeholder="Search"
              aria-label="Search"
            />
            <button
              onClick={searchHandler}
              className="btn btn-outline-success"
              type="submit"
            >
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
