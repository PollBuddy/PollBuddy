import React, { Component, useState, useRef, useEffect } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    // Close menu if click outside
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        menuProps.onStateChange();
      }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    // Stop propagation to Logout (so we don't log out every menu click) only if logged in
    if(localStorage.getItem("loggedIn") === "true") {
      document.getElementById("logout").addEventListener("click",function(e) {
        e.stopPropagation();
        fetch(process.env.REACT_APP_BACKEND_URL + "/users/logout", {
          method: "POST"
        }).then(response => {
          if(response.ok) {
            return response.json();
          } else {
            console.log("Error Logging Out");
          }
        }).then(response => {
          console.log(response);
          if(response.result === "success") {
            //Logout has succeeded, Clear frontend user data
            localStorage.setItem("loggedIn", "false");
            localStorage.removeItem("lastName");
            localStorage.removeItem("userName");
            localStorage.removeItem("firstName");
          } else {
            console.log("Error Logging Out");
          }
          //Navigates after response so that the redirect does not interrupt response
          navigate("/");
          //Reloads the page so that the logged-in menu closes
          //history.go(0);
        });
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
      <Link to="/account">Account</Link>
      <Link to="/code">Enter Poll Code</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/guide">Quick Start Guide</Link>
      <Link to="#" id="logout">Logout</Link>
    </div>
    // Logout routes to '/' in the event listeners above
  );
}

function LoggedOutMenu(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props);
  return (
    <div className = "Dropdown" ref={wrapperRef}>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/guide">Quick Start Guide</Link>
      <Link to="/code">Enter Poll Code</Link>
    </div>
  );
}

function DropdownMenu(props) {
  if(localStorage.getItem("loggedIn") === "true") {
    return LoggedInMenu(props);
  } else {
    return LoggedOutMenu(props);
  }
}
