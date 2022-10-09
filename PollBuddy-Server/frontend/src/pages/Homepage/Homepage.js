import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Homepage.scss";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import PollCode from "../../components/PollCode/PollCode";
import { useTitle, useLocal } from "../../hooks";

function Homepage() {
  useTitle("Home");
  const [ loggedIn, ] = useLocal("loggedIn");

  let innerView = null;
  if (loggedIn === "true") {
    innerView = <>
      <Link to="/account">
        <button className="button">My Account</button>
      </Link>
      <Link to="/groups">
        <button className="button">My Groups</button>
      </Link>
    </>;
  } else {
    innerView = <>
      <Link to="/login">
        <button className="button">Login</button>
      </Link>
      <Link to="/register">
        <button className="button">Register</button>
      </Link>
    </>;
  }

  return (
    <MDBContainer fluid className="page">
      <img src={logo} alt="logo" className="Homepage-logo img-fluid" />
      <MDBContainer className="two-box">
        <MDBContainer className="box">
          <p>
            Poll Buddy is an interactive questionnaire platform that aims to
            be an enjoyable and easy to use way to collect answers and
            insights from a group of people.
          </p>
          <MDBContainer>{innerView}</MDBContainer>
        </MDBContainer>
        <PollCode/>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(Homepage);