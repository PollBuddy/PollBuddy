import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";
import { useNavigate, Link } from "react-router-dom";
import { useFn, useLocal } from "../../hooks";

function _LoggedInMenu() {
  const navigate = useNavigate();

  const handleLogout = React.useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/users/logout`;
    const resp = await fetch(URL, { method: "POST" });
    if (!resp.ok) { return console.log("Error Logging Out"); }
    const data = await resp.json();

    console.log(data);
    if(data.result !== "success") { return console.log("Error Logging Out"); }

    // Logout has succeeded, Clear frontend user data.
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userName");
    localStorage.removeItem("firstName");
    // Navigates after response so that the redirect does not interrupt
    // response.
    navigate("/");
  }, [ navigate ]);

  return (
    <div className="Dropdown">
      <Link to="/account">Account</Link>
      <Link to="/code">Enter Poll Code</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/guide">Quick Start Guide</Link>
      <Link to="#" id="logout" onClick={handleLogout}>Logout</Link>
    </div>
    // Logout routes to '/' in the event listeners above
  );
}

const LoggedInMenu = React.memo(_LoggedInMenu);

function _LoggedOutMenu() {
  return (
    <div className="Dropdown">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/guide">Quick Start Guide</Link>
      <Link to="/code">Enter Poll Code</Link>
    </div>
  );
}

const LoggedOutMenu = React.memo(_LoggedOutMenu);

function _DropdownMenu() {
  const [ loggedIn, ] = useLocal("loggedIn");
  if (loggedIn === "true") {
    return <LoggedInMenu />;
  } else {
    return <LoggedOutMenu />;
  }
}

const DropdownMenu = React.memo(_DropdownMenu);

function _DropdownButton() {
  const [ open, setOpen ] = React.useState(false);

  const handleClickStop = React.useCallback(event => {
    setOpen(true);
    // If the event is allowed to propagate, it will be caught by the dropdown
    // and close immediately.
    event.stopPropagation();
  }, [ setOpen ]);

  const handleClick = useFn(setOpen, false);

  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [ handleClick ]);

  return (
    <span>
      <span className="Dropdown-button button" onClick={handleClickStop}>
        Menu
      </span>
      {open && <DropdownMenu />}
    </span>
  );
}

const DropdownButton = React.memo(_DropdownButton);

function Dropdown() {
  return <DropdownButton />;
}

export default React.memo(Dropdown);