import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import PollCode from "../../components/PollCode/PollCode";
import { useTitle } from "../../hooks";

function Code() {
  useTitle("Enter Poll Code");
 
  return (
    <MDBContainer fluid className="page">
      <PollCode/>
    </MDBContainer>
  );
}

export default React.memo(Code);