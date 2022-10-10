import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Link, useLocation } from "react-router-dom";
import { useTitle } from "../../hooks";

function LoginDefault() {
  useTitle("Login");
  const location = useLocation();

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <p className="bold fontSizeLarge">
          Login to Poll Buddy
        </p>
        <p className="fontSizeSmall">
          Click on one of the following buttons to login.
        </p>
        <Link to="/login/pollbuddy" state={location.state}>
          <button className="button">Login with Poll Buddy Account</button>
        </Link>

        <Link to="/login/school">
          <button className="button">Login with School Account</button>
        </Link>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(LoginDefault);
