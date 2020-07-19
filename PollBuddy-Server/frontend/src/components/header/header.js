import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "../../styles/header.scss";
import logo from "../../images/logo.png";

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
        link: "/registerDefault",
        text: "register"
      };
    } else if(this.props.userInfo.sessionIdentifier === "account") {
      this.state = {
        link: "/accountinfo",
        text: "account"
      };
    }
  }
  render() {
    return (
      <header className = "header_bar">
        <a href = "/">
          <img src = {logo} className = "header_bar_logo" alt = "logo" />
        </a>
        {this.props.title}
        <a href = {this.state.link} className = "header_bar_btn">
          {this.state.text}
        </a>
      </header>
    );
  }
}
