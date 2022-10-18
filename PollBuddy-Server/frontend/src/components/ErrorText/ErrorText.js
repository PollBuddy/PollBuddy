import React from "react";
import "./ErrorText.scss";
import { MDBContainer } from "mdbreact";

function ErrorText({ text }) {
  const errorText = text == null
    ? "An error has occurred. Please try again later."
    : `ERROR: ${text} Please try again.`;

  return (
    <MDBContainer className="errorContainer">
      {/* Pass in a text prop to customize the error text. */}
      <p>{errorText}</p>
    </MDBContainer>
  );
}

export default React.memo(ErrorText);