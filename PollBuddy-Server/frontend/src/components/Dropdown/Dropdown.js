import React, { Component, useState } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";
import "../Header/Header.scss";

export default class Dropdown extends Component {
  render() {
    return (
      <DropdownButton>
        <DropdownMenu></DropdownMenu>
      </DropdownButton>
    );
  }
}

function DropdownButton(props) {
  const [open, setOpen] = useState(false);
  return (
    <span onClick={() => setOpen(!open)}>
      <span className="header_bar_btn">Menu</span>

      {open && props.children}
    </span>
  );
}

function DropdownMenu() {

  function DropdownItem(props) {
    return (
      <a href={props.link} className="dropdown_menu_item">
        {props.children}
      </a>
    );
  }

  return (
    <div className="dropdown">
      <DropdownItem link="/login">Login</DropdownItem>
      <DropdownItem link="/">Logout</DropdownItem>
      <DropdownItem link="/register">Register</DropdownItem>
      <DropdownItem link="/account">Account</DropdownItem>
      <DropdownItem link="/poll/:pollID/view">Enter Poll Code</DropdownItem>
      <DropdownItem link="/groups">Groups</DropdownItem>
      <DropdownItem link="/">History</DropdownItem>
      <DropdownItem link="/">Settings</DropdownItem>
    </div>
  );
}
