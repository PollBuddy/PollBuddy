import React, { Component, useState, useRef, useEffect } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";

export default class Dropdown extends Component {
  render() {
    return (
      <DropdownButton />
    );
  }
}

function DropdownButton() {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  function handleStateChange() {
    setOpen(false);
    setClose(true);
  }
  function handleMenuClick() {
    if (!open && !close) {
      setOpen(true);
    } else {
      setOpen(false);
      setClose(false);
    }
  }
  return (
    <span>
      <span className="Dropdown-button button" onClick={handleMenuClick}>Menu</span>
      {open && <DropdownMenu onStateChange={handleStateChange} />}
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
      <a href={props.link}>
        {props.children}
      </a>
    );
  }

  return (
    <div className="Dropdown" ref={wrapperRef}>
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
