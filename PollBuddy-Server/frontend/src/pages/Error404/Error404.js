import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { useTitle } from "../../hooks";

function Error404() {
  useTitle("Page Not Found");

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <p className="fontSizeLarge">Error: page not found.</p>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(Error404);