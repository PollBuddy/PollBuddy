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
    // Stop propogation to Logout (so we don't log out every menu click) only if logged in
    if(localStorage.getItem("loggedIn") == "true") {
      document.getElementById("logout").addEventListener("click",function(e) {
        e.stopPropagation();
        fetch(process.env.REACT_APP_BACKEND_URL + "/users/logout", {
          method: "GET"
        }); 
        localStorage.setItem("loggedIn",false);
        localStorage.removeItem("lastName");
        localStorage.removeItem("userName");
        localStorage.removeItem("firstName");
      });
    }
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

function LoggedInMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);
  return (
    <div className = "Dropdown" ref={wrapperRef}>
      <a href="/account">Account</a>
      <a href="/code">Enter Poll Code</a>
      <a href="/groups">Groups</a>
      <a href="polls/history">History</a>
      <a href="/">Settings</a> 
      <a href="/" id="logout">Logout</a>
    </div> // settings page will probably be the account info page which will have to be renamed "Account Settings"
    //History currently directs to the same place as My Poll History Page in App.js
    //Settings seems to no longer be used, seems covered by Account, as described by old comment above
  );
}

function LoggedOutMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);
  return (
    <div className = "Dropdown" ref={wrapperRef}>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
      <a href="/code">Enter Poll Code</a>
    </div>
  );
}

function DropdownMenu(props) {
  if(localStorage.getItem("loggedIn") == "true") {
    return LoggedInMenu(props);
  } else {
    return LoggedOutMenu(props);
  }
}
