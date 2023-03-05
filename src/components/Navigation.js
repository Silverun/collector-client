import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import logo from "../img/cltr_logo_100.png";
import MiniSearch from "minisearch";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "../api/axios";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useTheme from "../hooks/useTheme";

const Navigation = () => {
  const [hamButton, setHamButton] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [langButtonText, setLangButtonText] = useState(
    localStorage.getItem("i18nextLng") || "en-US"
  );
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setDarkMode] = useState(theme === "light" ? false : true);
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation("nav");

  const miniSearch = new MiniSearch({
    fields: [
      "tags",
      "colDesc",
      "colName",
      "colTheme",
      "comments",
      "fieldsValues",
      "name",
    ],
    storeFields: ["name"],
    extractField: (document, fieldName) => {
      if (Array.isArray(document[fieldName])) {
        return document[fieldName].join(" ");
      } else {
        return document[fieldName];
      }
    },
    searchOptions: {
      prefix: true,
      boost: { name: 2 },
      fuzzy: 0.2,
    },
  });

  miniSearch.addAll(searchData);

  const searchClickHandler = async () => {
    setVisible(true);
    const { data } = await axios.get("/item/getsearchitems");
    setSearchData(data);
  };

  const toggleDarkModeHandler = (checked) => {
    checked ? setTheme("dark") : setTheme("light");
    console.log(checked);
    setDarkMode(checked);
  };

  const onInputChangeHandler = (e) => {
    setSearchInput(e.target.value);
    const results = miniSearch.search(e.target.value);
    setSearchResults(results);
    const suggestions = miniSearch.autoSuggest(e.target.value);
    setSearchSuggestions(suggestions);
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
    } catch (error) {
      console.log(error);
    }
  };

  const langButtonHandler = () => {
    if (langButtonText === "ru-RU") {
      i18n.changeLanguage("en-US");
      setLangButtonText("en-US");
    }
    if (langButtonText === "en-US") {
      i18n.changeLanguage("ru-RU");
      setLangButtonText("ru-RU");
    }
  };

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
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <h5 className="mb-5">{t("searchH3")}</h5>
          <InputText
            id="glob_search"
            value={searchInput}
            onChange={onInputChangeHandler}
          />
          <div className="my-3">
            <small id="glob_search-help">
              {searchSuggestions.map((sug) => (
                <span className="me-3" key={sug.score}>
                  {sug.suggestion}
                </span>
              ))}
            </small>
          </div>
          <ListGroup variant="flush">
            {searchResults.map((result) => (
              <ListGroup.Item
                onClick={() => {
                  setVisible(false);
                  navigate(`item/${result.id}`);
                }}
                action
                key={result.id + result.name}
              >
                {result.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Sidebar>
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
                  {auth.username}
                  {t("userCol")}
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
                  {t("login")}
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
                  {t("adminDash")}
                </NavLink>
              </li>
            ) : null}
          </ul>
          <Button
            onClick={langButtonHandler}
            text
            severity="secondary"
            label={langButtonText}
            icon="pi pi-language"
          />
          <Button
            onClick={searchClickHandler}
            text
            severity="secondary"
            label={t("searchLabel")}
            icon="pi pi-search"
          />
          <DarkModeSwitch
            className="mx-3"
            checked={isDarkMode}
            onChange={toggleDarkModeHandler}
            size={25}
            moonColor="#b6d4f2"
          />
          {auth.role ? (
            <button
              onClick={logoutButtonHandler}
              className="btn btn-outline-success ms-2"
              type="button"
            >
              {t("logout")}
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
