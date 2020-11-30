import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Header.scss";
import logo from "../../images/logo.png";
import Dropdown from "../Dropdown/Dropdown.js";

export default class Header extends Component {
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
