import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Header.scss";
import logo from "../../images/logo.png";
import Dropdown from "../Dropdown/Dropdown.js";

function Header({ userInfo }) {
  const { sessionIdentifier } = userInfo ?? {};
  let link, text;

  if (sessionIdentifier === "") {
    link = "/login";
    text = "login";
  } else if (sessionIdentifier === "register") {
    link = "/register";
    text = "register";
  } else if (sessionIdentifier === "account") {
    link = "/AccountInfo";
    text = "account";
  }

  return (
    <header className="Header-bar">
      <a href="/"><img src={logo} className="Header-bar-logo" alt="logo"/></a>
      <Dropdown/>
    </header>
  );
}

export default Header;