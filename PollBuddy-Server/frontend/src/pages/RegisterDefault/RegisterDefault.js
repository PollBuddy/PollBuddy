import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Link } from "react-router-dom";
import { useTitle } from "../../hooks";

function RegisterDefault() {
  useTitle("Register");

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <p className="fontSizeLarge">Register with Poll Buddy</p>
        <p>Click on one of the following buttons to register.</p>
        <Link to="/register/pollbuddy">
          <button className="button">Register with Poll Buddy</button>
        </Link>
        <Link to="/register/school">
          <button className="button">Register with School</button>
        </Link>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(RegisterDefault);