import React from "react";
import autosize from "autosize";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";

import SchoolPicker from "../../components/SchoolPicker/SchoolPicker";
import { useTitle, useAsyncEffect, useFn } from '../../hooks';

/*----------------------------------------------------------------------------*/

function Contact() {
  useTitle("Contact Us");

  const [ formUp, setFormUp ] = React.useState(false);
  const [ done, setDone ] = React.useState(false);
  const [ email, setEmail ] = React.useState("");
  const [ value, setValue ] = React.useState("");
  const [ fullName, setFullName ] = React.useState("");
  const [ , setDesc ] = React.useState("");

  React.useEffect(() => {
    autosize(document.querySelector("textarea"));
  }, [ ]);

  useAsyncEffect(async () => {
    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
      method: "GET",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
    });

    const { data } = await resp.json();
    const { FirstName, LastName, SchoolAffiliation, Email } = data;

    setFullName(FirstName + " " + LastName);
    setValue(SchoolAffiliation);
    setEmail(Email);
  }, [ setFullName, setValue, setEmail ]);

  const handleSendTicket = React.useCallback(() => {
    setFormUp(false);
    setDone(true);
  }, [ setFormUp, setDone ]);

  const handleTicket = React.useCallback(() => {
    setFormUp(true);
    setDone(false);
  }, [ setFormUp, setDone ]);

  const handleFullName = useFn(setFullName, e => e.target.value);
  const handleValue = useFn(setValue, e => e.target.value);
  const handleEmail = useFn(setEmail, e => e.target.value);
  const handleDesc = useFn(setDesc, e => e.target.value);

  const inputStyles = {
    display: formUp ? "flex" : "none",
    width: "50%", // Add this to CSS it is static.
  };

  const fileStyles = {
    display: formUp ? "none" : "",
  };

  return (
    <MDBContainer fluid className="page">
      <MDBContainer className = "box">
        <p className="fontSizeLarge">
          Looking to get in touch with a developer? Shoot an email over to
          <a href="mailto:contact@pollbuddy.app">contact@pollbuddy.app</a>
          or click the button below to open a support ticket form.
        </p>
        <p>
          Alternatively, it would be greatly appreciated if you reported
          technical problems, such as bugs or design complaints/suggestions, by
          <a href="https://github.com/PollBuddy/PollBuddy/issues/new/choose">
            opening an issue
          </a>
          on our
          <a href="https://github.com/PollBuddy/PollBuddy">
            GitHub repository.
          </a>
        </p>
        <button className="button" style={fileStyles} onClick={handleTicket}>
          File Support Ticket
        </button>
      </MDBContainer>
      <MDBContainer fluid className="box" style={inputStyles}>
        <p className="fontSizeLarge">Support Ticket Information</p>
        <MDBContainer className="form-group">
          <label htmlFor="name">Full name:</label>
          <input required
            className="form-control textBox"
            id="name"
            placeholder="Name"
            value={fullName}
            onChange={handleFullName}
          />

          <label htmlFor="school">School (if applicable):</label>
          <SchoolPicker value={value} onChange={handleValue}
            onSelect={setValue}/>

          <label htmlFor="email">Email:</label>
          <input required
            className="form-control textBox"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
          />

          <label htmlFor="description">Description of the issue:</label>
          <textarea required
            className="form-control textBox"
            id="description"
            maxLength="500"
            placeholder="500 character limit"
            onChange={handleDesc}
          />

          <button className="button" onClick={handleSendTicket}>
            Send Ticket
          </button>
        </MDBContainer>
      </MDBContainer>
      <MDBContainer fluid className = "box" style={inputStyles}>
        <p className = "fontSizeLarge">
          Thank you for your support! Your form has been submitted. If you have
          any other issues, please file another support form.
        </p>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default React.memo(Contact);