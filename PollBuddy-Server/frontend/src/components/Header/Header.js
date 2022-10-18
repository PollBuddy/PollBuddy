import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Header.scss";
import logo from "../../images/logo.png";
import Dropdown from "../Dropdown/Dropdown.js";
import { Link } from "react-router-dom";

function Header(/*{ userInfo }*/) {
  // TODO: This needs further reworking. I'm thinking it always shows login unless it detects a certain page title,
  // in which case it may display register. This also will need to show account once logged in.

  // let link, text;
  // if (this.props.userInfo.sessionIdentifier === "") {
  //   link = "/login";
  //   text = "login";
  // } else if (this.props.userInfo.sessionIdentifier === "register") {
  //   link = "/register";
  //   text = "register";
  // } else if (this.props.userInfo.sessionIdentifier === "account") {
  //   link = "/AccountInfo";
  //   text = "account";
  // }

  return (
    <header className="Header-bar">
      <Link to="/">
        <img src={logo} className="Header-bar-logo" alt="logo" />
      </Link>
      <Dropdown />
    </header>
  );
}

export default React.memo(Header);