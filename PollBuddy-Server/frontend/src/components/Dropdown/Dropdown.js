import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";
import { useNavigate, Link } from "react-router-dom";
import { useFn } from "../../hooks";

function LoggedInMenu() {
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

    // Reloads the page so that the logged-in menu closes.
    // history.go(0);
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

function LoggedOutMenu() {
  return (
    <div className="Dropdown">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/guide">Quick Start Guide</Link>
      <Link to="/code">Enter Poll Code</Link>
    </div>
  );
}

function DropdownMenu(props) {
  if (localStorage.getItem("loggedIn") === "true") {
    return LoggedInMenu(props);
  } else {
    return LoggedOutMenu(props);
  }
}

function DropdownButton() {
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

function Dropdown() {
  return <DropdownButton />;
}

export default Dropdown;