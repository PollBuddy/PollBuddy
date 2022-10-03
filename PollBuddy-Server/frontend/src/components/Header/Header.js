import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Header.scss";
import logo from "../../images/logo.png";
import Dropdown from "../Dropdown/Dropdown.js";

/*----------------------------------------------------------------------------*/

function Header({ userInfo: { sessionIdentifier: sessionID } }) {
  // let link, text;

  // switch (sessionID) {
  // case "":
  //   link = "/login";
  //   text = "login";
  //   break;
  // case "register":
  //   link = "/register";
  //   text = "register";
  //   break;
  // case "account":
  //   link = "/AccountInfo";
  //   text = "account";
  //   break;
  // }

  return (
    <header className="Header-bar">
      <a href="/">
        <img src = {logo} className="Header-bar-logo" alt="logo" />
      </a>
      <Dropdown />
    </header>
  );
}

/*----------------------------------------------------------------------------*/

export default Header;