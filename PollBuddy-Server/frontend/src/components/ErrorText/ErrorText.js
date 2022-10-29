import React, {Component} from "react";
import "./ErrorText.scss";
import {MDBContainer} from "mdbreact";

export default class ErrorText extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.show) {
      return (
        <MDBContainer className="errorContainer">
          <p>{this.props.text === undefined ? "An error has occurred. Please try again later." : "ERROR: " + this.props.text + " Please try again."}</p>
        </MDBContainer>
      );
    }
  }
}
