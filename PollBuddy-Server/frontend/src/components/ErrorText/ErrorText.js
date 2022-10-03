import React from "react";
import "./ErrorText.scss";
import { MDBContainer } from "mdbreact";

export default function ErrorText({ text }) {
  return (
    <MDBContainer className="errorContainer">
      {/* Pass in a text prop to customize the error text. */}
      <p>
        { text === undefined
        ? "An error has occurred. Please try again later."
        : "ERROR: " + text + " Please try again."
        }
      </p>
    </MDBContainer>
  );
}
