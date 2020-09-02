import React, { Component } from "react";
import './loadingWheel.scss';
import { MDBContainer } from "mdbreact";

export default class LoadingWheel extends Component{
  render(){
    return (
      <MDBContainer className="loader"></MDBContainer>
    );
  }
}