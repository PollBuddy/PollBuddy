import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";

export default class Error404 extends Component {

  componentDidMount() {
    this.props.updateTitle("Page Not Found");
  }

  render() {
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
}
