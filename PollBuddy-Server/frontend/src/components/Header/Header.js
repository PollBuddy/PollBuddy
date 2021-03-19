import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Header.scss";
import logo from "../../images/logo.png";
import Dropdown from "../Dropdown/Dropdown.js";

export default class Header extends Component {
  constructor(props) {
    super(props);
    // TODO: This needs further reworking. I'm thinking it always shows login unless it detects a certain page title,
    // in which case it may display register. This also will need to show account once logged in.
    if(this.props.userInfo.sessionIdentifier === "") {
      this.state = {
        link: "/login",
        text: "login"
      };
    } else if(this.props.userInfo.sessionIdentifier === "register") {
      this.state = {
        link: "/register",
        text: "register"
      };
    } else if(this.props.userInfo.sessionIdentifier === "account") {
      this.state = {
        link: "/AccountInfo",
        text: "account"
      };
    }
  }
  render() {
    return (
      <header className = "Header-bar">
        <a href = "/">
          <img src = {logo} className = "Header-bar-logo" alt = "logo" />
        </a>
        <Dropdown />
      </header>
    );
  }
}
