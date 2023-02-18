import React, { Component } from "react";
import "./ErrorText.scss";
import { MDBContainer } from "mdbreact";

function ErrorText({ text }) {
  return (
    <MDBContainer className="errorContainer">
      {/* Pass in a text prop to customize the error text. */}
      <p>
        { text === undefined
        ? "An error has occurred. Please try again later."
        : "ERROR: " + text + " Please try again."}
      </p>
    </MDBContainer>
  );
}

export default ErrorText;
