import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import PollCode from "../../components/PollCode/PollCode";

/*----------------------------------------------------------------------------*/

function Code({ updateTitle }) {
  React.useEffect(() => {
    updateTitle?.("Enter Poll Code");
  }, [ updateTitle ]);

  return (
    <MDBContainer fluid className="page">
      <PollCode/>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default Code;