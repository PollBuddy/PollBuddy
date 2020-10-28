import React, { Component, useState, useRef, useEffect } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";
import "../Header/Header.scss";

export default class Dropdown extends Component {
  render() {
    return (
      <DropdownButton></DropdownButton>
    );
  }
}

function DropdownButton() {
  const [open, setOpen] = useState(false);
  function handleStateChange() {
    setOpen(!open);
  }
  return (
    <span onClick={() => setOpen(!open)}>
      <span className="header_bar_btn">Menu</span>

      {open && <DropdownMenu onStateChange={handleStateChange}></DropdownMenu>}
    </span>
  );
}

function useOutsideAlerter(ref, menuProps) {
  useEffect(() => {
    // Close menu if click outside
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        menuProps.onStateChange();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function DropdownMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);

  function DropdownItem(props) {
    return (
      <a href={props.link} className="dropdown_menu_item">
        {props.children}
      </a>
    );
  }

  return (
    <div ref={wrapperRef}>
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
    </div>
  );
}
