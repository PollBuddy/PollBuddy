import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { LoadingWheel } from "../../components";
import "./AccountInfo.scss";
import { selectTarget, selectToggle, useAsyncEffect, useCompose, useTitle } from "../../hooks";
const Joi = require("joi");

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const SCHEMA = Joi.object({
  user: Joi.string()
    .pattern(/^(?=.{3,32}$)[a-zA-Z0-9-._]+$/)
    .error(new Error("Username must be between 3 and 32 characters. Valid ch" +
      "aracters include letters, numbers, underscores, dashes, and periods.")),
  email: Joi.string()
    .email({ tlds: { allow: false }, minDomainSegments: 2 })
    .max(320)
    .error(new Error("Invalid email format.")),
  first: Joi.string()
    .min(1).max(256)
    .error(new Error("Invalid first name format.")),
  last: Joi.string()
    .allow(" ").max(256)
    .error(new Error("Invalid last name format.")),
  password: Joi.string()
    .pattern(/^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$/)
    .pattern(/^.*[0-9].*$/)
    .pattern(/^.*[A-Z].*$/)
    .error(new Error("Invalid password. Must contain 10 or more characters, " +
      "at least 1 uppercase letter, and at least 1 number. Cannot have 4 of " +
      "the same characters in a row."))
});

function useField(_value, _locked, _text) {
  const [ value, setValue ] = React.useState(_value);
  const [ locked, setLocked ] = React.useState(_locked);
  const [ text, setText ] = React.useState(_text);

  const onValue = React.useCallback((__value, __locked) => {
    setValue(__value);
    setLocked(__locked);
  }, [ setValue, setLocked ]);

  return { value, setValue, locked, setLocked, text, setText, onValue };
}

function AccountInfo() {
  useTitle("Account Info");

  const user = useField("", false, null);
  const first = useField("", false, null);
  const last = useField("", false, null);
  const email = useField("", false, null);

  const [ error, setError ] = React.useState(null);
  const [ done, setDone ] = React.useState(false);
  const [ loaded, setLoaded ] = React.useState(false);
  const [ logout, setLogout ] = React.useState(false);
  const [ school, setSchool ] = React.useState("None");

  const [ changePswd, setChangePswd ] = React.useState(false);
  const [ pswdLocked, setPswdLocked ] = React.useState(false);
  const [ pswd, setPswd ] = React.useState("");
  const [ showPswd, setShowPswd ] = React.useState(false);

  useAsyncEffect(async () => {
    const response = await fetch(BACKEND + "/users/me", { method: "GET" });
    const { data } = await response.json();

    // Load states from database values.
    if (data.userName) { user.onValue(data.userName, data.userNameLocked); }
    if (data.firstName) { first.onValue(data.firstName, data.firstNameLocked); }
    if (data.lastName) { last.onValue(data.lastName, data.lastNameLocked); }
    if (data.email) { email.onValue(data.email, data.emailLocked); }

    if (data.schoolAffiliation) {
      setSchool(data.schoolAffiliation);
      setPswdLocked(true);
    }

    if (data.logOutEverywhere) { setLogout(data.logOutEverywhere); }
    setLoaded(true);
  }, [ ]);

  const saveChanges = React.useCallback(async () => {
    setDone(false);
    setError(null);

    // Ensure that the inputs are valid, if not return.
    const userValid = user.text? SCHEMA.validate({ user: user.text }): {};
    const firstValid = first.text? SCHEMA.validate({ first: first.text }): {};
    const lastValid = last.text? SCHEMA.validate({ last: last.text }): {};
    const emailValid = email.text? SCHEMA.validate({ email: email.text }): {};
    const pswdValid = pswd ? SCHEMA.validate({ password: pswd }) : {};

    const ERR = userValid.error || firstValid.error || lastValid.error
      || emailValid.error || pswdValid.error;

    if (ERR) { return setError(ERR.toString()); }
    
    const response = await fetch(BACKEND + "/users/me/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // TODO: keep track of each of the initial states of these; only want to
      // put in the changed values.
      // UPDATE: Puts in all non-locked values.
      body: JSON.stringify({
        firstName: first.locked ? undefined : (first.text ?? first.value),
        lastName: last.locked ? undefined : (last.text ?? last.value),
        userName: user.locked ? undefined : (user.text ?? user.value),
        email: email.locked ? undefined : (email.text ?? email.value),
        password: pswdLocked ? undefined : pswd,
        logOutEverywhere: logout,
      })
    });

    const out = await response.json();
    console.log(out);
    
    setDone(true);
  }, [ email.locked, email.text, email.value, first.locked, first.text,
    first.value, last.locked, last.text, last.value, pswd, pswdLocked,
    user.locked, user.text, user.value, logout ]);

  const handleLogout = React.useCallback(async () => {
    setLogout(selectToggle);

    const response = await fetch(BACKEND + "/users/me/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        // TODO: needs to be verified to function.
        password: undefined,
        logOutEverywhere: logout,
      }
    });

    console.log(response);
  }, [ logout ]);

  const handleFirst = useCompose(first.setText, selectTarget);
  const handleLast = useCompose(last.setText, selectTarget);
  const handleUser = useCompose(user.setText, selectTarget);
  const handleEmail = useCompose(email.setText, selectTarget);
  const handlePswd = useCompose(setPswd, selectTarget);

  const toggleChangePswd = useCompose(setChangePswd, selectToggle);
  const toggleShowPswd = useCompose(setShowPswd, selectToggle);

  const pswdStyle = { display: changePswd ? "flex" : "none" };

  if (!loaded) {
    return (
      <MDBContainer className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <h1>Account Settings</h1>
        <MDBContainer>
          <MDBRow className="AccountInfo-accountInputs">
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="firstnameText">First Name:</label>
              <input defaultValue={first.value} className="form-control textBox"
                id="firstnameText" readOnly={first.locked} onChange={handleFirst}/>
            </MDBCol>
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="lastnameText">Last Name:</label>
              <input defaultValue={last.value} className="form-control textBox"
                id="lastnameText" readOnly={last.locked} onChange={handleLast}/>
            </MDBCol>
          </MDBRow>

          <MDBRow className="AccountInfo-accountInputs">
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="usernameText">Username:</label>
              <input value={user.value} className="form-control textBox"
                id="usernameText" readOnly={user.locked} onChange={handleUser}/>
            </MDBCol>
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="emailText">Email:</label>
              <input defaultValue={email.value} className="form-control textBox"
                id="emailText" readOnly={email.locked} onChange={handleEmail}/>
            </MDBCol>
          </MDBRow>

          <MDBRow className="AccountInfo-accountInputs">
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="school">School:</label>
              <input className="form-control textBox" id="school" value={school}
                readOnly/>
            </MDBCol>
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="passwordChange">Password:</label>
              <p id="AccountInfo-passwordChange" onClick={toggleChangePswd}>
                { changePswd
                  ? "Cancel password change"
                  : "Click to change password" }
              </p>
            </MDBCol>
          </MDBRow>

          <MDBContainer id="AccountInfo-changePasswordInputs" style={pswdStyle}>
            <MDBCol md="6" className="AccountInfo-mdbcol-6">
              <label htmlFor="newPasswordText">New password:</label>
              <input type={showPswd ? "text" : "password"}
                placeholder="••••••••••••" className="form-control textBox"
                id="newPasswordText" readOnly={pswdLocked}
                onChange={handlePswd}/>
              <i className="AccountInfo-i fas fa-eye" onClick={toggleShowPswd}/>
            </MDBCol>
          </MDBContainer>
        </MDBContainer>

        <div id="AccountInfo-logOutEverywhere" style={pswdStyle}>
          <input type="checkbox" onChange={handleLogout} className="logOutBox"
            id="logOutEverywhere" checked={logout}/>
          <label className="logOutLabel" htmlFor="logOutEverywhere">
            Log out everywhere?
          </label>
        </div>

        {/* TODO: Update this to have a backend call instead of a "to", plus
        some result popup */}
        <p className="fontSizeLarge" style={{ display: done ? "" : "none" }}>
          Your changes have been submitted. Thank you.
        </p>
        <p className="fontSizeLarge" style={{ display: error ? "": "none" }}>
          {error}
        </p>
        <button className="button" onClick={saveChanges}>
          Save Changes
        </button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(AccountInfo);