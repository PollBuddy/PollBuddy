import React, { Component } from "react";
import "./ErrorText.scss";
import { MDBContainer } from "mdbreact";

export default class ErrorText extends Component{
  render(){
    return (
      <MDBContainer className="errorContainer">
        {/*pass in a text prop to customize the error text*/}
        <h6 className={"errorText"}>{this.props.text === undefined ? "An error has occurred. Please try again later.": "ERROR: " + this.props.text}</h6>
      </MDBContainer>
    );
  }
}
