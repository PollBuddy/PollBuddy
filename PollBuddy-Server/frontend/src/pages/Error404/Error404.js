import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";

/*----------------------------------------------------------------------------*/

function Error404({ updateTitle }) {
  React.useEffect(() => {
    updateTitle?.("Page Not Found");
  }, [ updateTitle ]);

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <p className="fontSizeLarge">
          Error: page not found.
        </p>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default Error404;