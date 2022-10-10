import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import "mdbreact/dist/css/mdb.css";
import "./LoginWithPollBuddy.scss";
import { MDBContainer } from "mdbreact";
import { useFn, useLocal, useTitle } from "../../hooks";
const Joi = require("joi");

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const FORGOT = "\nForgot your password? Try clicking \"Forgot Password?\" to reset your password.";

const SCHEMA = Joi.object({
  username: Joi.string()
    .pattern(/^(?=.{3,32}$)[a-zA-Z0-9-._]+$/)
    .error(new Error("Please enter a valid username or email.")),
  email: Joi.string()
    .email({ tlds: { allow: false }, minDomainSegments: 2 }).max(320)
    .error(new Error("Please enter a valid username or email.")),
  password: Joi.string()
    .pattern(/^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$/)
    .pattern(/^.*[0-9].*$/)
    .pattern(/^.*[A-Z].*$/)
    .error(new Error("Please enter a valid password.")),
});

function LoginWithPollBuddy() {
  useTitle("Login With Poll Buddy");

  const location = useLocation();
  const prevRoute = location.state?.prevRoute ?? "/";
  const [ loggedIn, setLoggedIn ] = useLocal("loggedIn");

  const [ error, setError ] = React.useState("");
  const [ attempts, setAttempts ] = React.useState(0);
  const [ user, setUser ] = React.useState("");
  const [ pswd, setPswd ] = React.useState("");

  const handleUser = useFn(setUser, e => e.target.value);
  const handlePswd = useFn(setPswd, e => e.target.value);

  const handleLogin = React.useCallback(async () => {
    // We need to validate each separately because either username or email
    // could work.
    const validUsername = SCHEMA.validate({ username: user });
    const validEmail = SCHEMA.validate({ email: user });
    const validPassword = SCHEMA.validate({ password: pswd });

    if (validUsername.error && validEmail.error) {
      return setError(validUsername.error); // Error in username/email.
    } else if (validPassword.error) {
      return setError(validPassword.error); // Error in password.
    }

    // No errors.
    setError("");

    // Login request to backend.
    try {
      // Needs some authentication before and if authentication passes then
      // set local storage and such refer to GroupCreation page to see the
      // way to make POST requests to the backend.
      const response = await fetch(BACKEND + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userNameEmail: user, password: pswd }),
      });
    
      if (response.ok) {
        // Maybe have an admin/teacher var instead of just true.
        setLoggedIn("true");
      } else {
        setError("Invalid username/email and password combination");
        setAttempts(s => s + 1);
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred during login. Please try again");
    }
  }, [ pswd, setLoggedIn, user ]);

  // Basically redirect if the person is logged in or if their login succeeds.
  if (loggedIn === "true") {
    return <Navigate push to={prevRoute}/>;
  }

  let trueError = error;
  // If too many login attempts, offer to reset password.
  if (error && attempts > 6) { trueError += FORGOT; }

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <MDBContainer className="form-group">
          <label htmlFor="userNameEmail">Username or Email:</label>
          <input type="userNameEmail" id="userNameEmail" onChange={handleUser}
            className="form-control textBox" placeholder="Your username or email"/>

          <label htmlFor="password">Password:</label>
          <input type="password" placeholder="••••••••••••" id="password"
            className="form-control textBox"onChange={handlePswd}/>
        </MDBContainer>

        <p style={{ color: "red" }}>{trueError}</p>
        <button className="button" onClick={handleLogin}>Submit</button>

        <Link className="Login-link" to="/register">Register</Link>
        <Link className="Login-link" to="/login/forgot">Forgot Password?</Link>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(LoginWithPollBuddy);