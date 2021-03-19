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
  function handleStateChange() {
    setOpen(!open);
  }
  return (
    <span>
      <span className="Dropdown-button button" onClick={handleStateChange}>Menu</span>
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
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

function DropdownMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);
  return (
    <div className="Dropdown" ref={wrapperRef}>
      <a href="/login">Login</a>
      <a href="/">Logout</a>
      <a href="/register">Register</a>
      <a href="/account">Account</a>
      <a href="/groups">Groups</a>
      <a href="/polls/history">History</a>
      <a href="/code">Enter Poll Code</a>
      {/* <a href="/">Settings</a> */}
    </div>
  ); // settings page will probably be the account info page which will have to be renamed "Account Settings"
}
