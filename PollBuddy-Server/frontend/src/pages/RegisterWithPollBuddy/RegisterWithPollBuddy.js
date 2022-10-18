import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Navigate } from "react-router-dom";
import "./RegisterWithPollBuddy.scss";
import { selectTarget, selectToggle, useCompose, useTitle } from "../../hooks";
const Joi = require("joi");

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const SCHEMA = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9-._]+$"))
    .error(new Error("Username must be between 3 and 32 characters. Valid ch" +
      "aracters include letters, numbers, underscores, dashes, and periods.")),
  email: Joi.string()
    .email({ tlds: { allow: false }, minDomainSegments: 2 })
    .max(320)
    .error(new Error("Invalid email format.")),
  password: Joi.string()
    .pattern(new RegExp("^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$"))
    .pattern(new RegExp("^.*[0-9].*$"))
    .pattern(new RegExp("^.*[A-Z].*$"))
    .error(new Error("Invalid password. Must contain 10 or more characters, " +
      "at least 1 uppercase letter, and at least 1 number. Cannot have 4 of " +
      "the same characters in a row.")),
  firstname: Joi.string()
    .min(1)
    .max(256)
    .error(new Error("First name must be between 1 and 256 characters.")),
  lastname: Joi.string()
    .allow("")
    .max(256)
    .error(new Error("Last name must be less than 256 characters.")),
});

function RegisterWithPollBuddy() {
  useTitle("Register with Poll Buddy");

  const [ user, setUser ] = React.useState("");
  const [ userError, setUserError ] = React.useState(true);
  const [ email, setEmail ] = React.useState("");
  const [ emailError, setEmailError ] = React.useState(true);
  const [ pswd, setPswd ] = React.useState("");
  const [ pswdError, setPswdError ] = React.useState(true);
  const [ first, setFirst ] = React.useState("");
  const [ firstError, setFirstError ] = React.useState(true);
  const [ last, setLast ] = React.useState("");
  const [ lastError, setLastError ] = React.useState(true);

  const [ success, setSuccess ] = React.useState(false);
  const [ showPswd, setShowPswd ] = React.useState(false);

  const togglePswd = useCompose(setShowPswd, selectToggle);

  const handleRegister = React.useCallback(async () => {
    // Do input validation.
    const userCheck = SCHEMA.validate({ username: user });
    const emailCheck = SCHEMA.validate({ email: email });
    const pswdCheck = SCHEMA.validate({ password: pswd });
    const firstCheck = SCHEMA.validate({ firstname: first });
    const lastCheck = SCHEMA.validate({ lastname: last });

    // Update component's state.
    setUserError(userCheck.error?.toString());
    setEmailError(emailCheck.error?.toString());
    setPswdError(pswdCheck.error?.toString());
    setFirstError(firstCheck.error?.toString());
    setLastError(lastCheck.error?.toString());

    if (userCheck.error || emailCheck.error || pswdCheck.error ||
        firstCheck.error || lastCheck.error) { return; }

    try {
      const response = await fetch(BACKEND + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first,
          lastName: last,
          userName: user.toLowerCase(),
          email: email.toLowerCase(),
          password: pswd,
        }),
      });

      if (!response.ok) { return; }

      localStorage.setItem("loggedIn", "true");
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }
  }, [ email, first, last, pswd, user ]);

  const handleFirst = useCompose(setFirst, selectTarget);
  const handleLast = useCompose(setLast, selectTarget);
  const handleUser = useCompose(setUser, selectTarget);
  const handleEmail = useCompose(setEmail, selectTarget);
  const handlePswd = useCompose(setPswd, selectTarget);

  const errorStyles = { color: "red" };

  if (success) { return <Navigate to="/groups" />; }

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <p className="fontSizeLarge">Register with Poll Buddy</p>
        <p>To create an account, fill in the text boxes, then press submit.</p>
        <MDBContainer className="form-group">
          <label htmlFor="firstnameText">First Name:</label>
          <input placeholder="Your first name" className="form-control textBox"
            id="firstnameText" onChange={handleFirst}/>
          { firstError && <p style={errorStyles}>{firstError}</p> }

          <label htmlFor="lastnameText">Last Name:</label>
          <input placeholder="Your last name" className="form-control textBox"
            id="lastnameText" onChange={handleLast}/>
          { lastError && <p style={errorStyles}>{lastError}</p> }

          <label htmlFor="usernameText">Username:</label>
          <input placeholder="Your username" className="form-control textBox"
            id="usernameText" onChange={handleUser}/>
          { userError && <p style={errorStyles}>{userError}</p> }

          <label htmlFor="emailText">Email:</label>
          <input placeholder="Your email address" id="emailText"
            className="form-control textBox" onChange={handleEmail}/>
          { emailError && <p style={errorStyles}>{emailError}</p> }

          <label htmlFor="passwordText">Password:</label>
          <p className="password_container">
            <input type={showPswd ? "text" : "password"} id="passwordText"
              placeholder="••••••••••••" className="form-control textBox"
              onChange={handlePswd}/>

            <i className="fas fa-eye" onClick={togglePswd}></i>
          </p>
          { pswdError && <p style={errorStyles}>{pswdError}</p> }
        </MDBContainer>
        <button className="button" onClick={handleRegister}>Submit</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(RegisterWithPollBuddy);