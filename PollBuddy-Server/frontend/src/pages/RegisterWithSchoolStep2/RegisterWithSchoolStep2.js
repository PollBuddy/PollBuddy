import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { ErrorText } from "../../components";
import { selectTarget, useCompose, useTitle } from "../../hooks";
import { useNavigate, useParams } from "react-router-dom";
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
  firstname: Joi.string()
    .min(1)
    .max(256)
    .error(new Error("First name must be between 1 and 256 characters.")),
  lastname: Joi.string()
    .allow("")
    .max(256)
    .error(new Error("Last name must be less than 256 characters.")),
});

function RegisterWithSchoolStep2() {
  useTitle("Register with School");
  const navigate = useNavigate();

  const { data: _data } = useParams();
  const params = JSON.parse(_data ?? "{}");

  const [ first, setFirst ] = React.useState(params.firstName ?? "");
  const [ firstError, setFirstError ] = React.useState(null);
  const firstPrefill = !!params.firstName;

  const [ last, setLast ] = React.useState(params.lastName ?? "");
  const [ lastError, setLastError ] = React.useState(null);
  const lastPrefill = !!params.lastName;

  const [ user, setUser ] = React.useState(params.userName ?? "");
  const [ userError, setUserError ] = React.useState(null);
  const userPrefill = !!params.userName;

  const [ email, setEmail ] = React.useState(params.email ?? "");
  const [ emailError, setEmailError ] = React.useState(null);
  const emailPrefill = !!params.email;

  const [ error, setError ] = React.useState(null);

  const handleRegister = React.useCallback(async () => {
    // Do input validation.
    const firstValid = SCHEMA.validate({ firstname: first });
    const lastValid = SCHEMA.validate({ lastname: last });
    const userValid = SCHEMA.validate({ username: user });
    const emailValid = SCHEMA.validate({ email: email });

    // Update component's state.
    setFirstError(firstValid.error?.toString());
    setLastError(lastValid.error?.toString());
    setUserError(userValid.error?.toString());
    setEmailError(emailValid.error?.toString());

    if (userValid.error || emailValid.error || lastValid.error ||
        firstValid.error) { return; }

    // If all are valid, submit a request to the backend to do the registration
    // TODO: This URL is going to need to be fixed and made dynamic.
    const response = await fetch(BACKEND + "/users/register/rpi", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        firstName: first,
        lastName: last,
        userName: user,
        email: email,
      }),
    });

    const data = await response.json();
    if (data == null) { return; }

    // TODO: Debug print, delete.
    console.log(data);

    if (data.result === "success") {
      // Save data about the user.
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("firstName", data.data.firstName);
      localStorage.setItem("lastName", data.data.lastName);
      localStorage.setItem("userName", data.data.userName);

      // Redirect to the groups page.
      return navigate("/groups", { replace: true });
    } else {
      // Something went wrong, handle it.
      if (data.error === "Validation failed") {
        setError(data.data.errors);
      } else {
        setError(data.error);
      }

      console.log("ERROR: " + error);
    }
  }, [ email, error, first, last, navigate, user ]);

  const handleFirst = useCompose(setFirst, selectTarget);
  const handleLast = useCompose(setLast, selectTarget);
  const handleUser = useCompose(setUser, selectTarget);
  const handleEmail = useCompose(setEmail, selectTarget);

  const errorStyle = { color: "red" };

  if (error != null) {
    return <ErrorText text={error}></ErrorText>;
  } else {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">Register with School</p>
          <p>To finish creating your account, fill in the text boxes, then press submit.</p>
          <MDBContainer className="form-group">
            <label htmlFor="firstnameText">First Name:</label>
            <input placeholder="SIS" className="form-control textBox"
              id="firstnameText" value={first} readOnly={firstPrefill}
              onChange={handleFirst}/>
            { firstError && <p style={errorStyle}>{firstError}</p> }

            <label htmlFor="lastnameText">Last Name:</label>
            <input placeholder="Man" className="form-control textBox"
              id="lastnameText" value={last} readOnly={lastPrefill}
              onChange={handleLast}/>
            { lastError && <p style={errorStyle}>{lastError}</p> }

            <label htmlFor="usernameText">Username:</label>
            <input placeholder="mans" className="form-control textBox"
              id="usernameText" value={user} readOnly={userPrefill}
              onChange={handleUser}/>
            { userError && <p style={{color: "red"}}>{userError}</p> }

            <label htmlFor="emailText">Email:</label>
            <input placeholder="mans@rpi.edu" className="form-control textBox"
              id="emailText" value={email} readOnly={emailPrefill}
              onChange={handleEmail}/>
            { emailError && <p style={errorStyle}>{emailError}</p> }
          </MDBContainer>
          <button className="button" onClick={handleRegister}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default React.memo(RegisterWithSchoolStep2);