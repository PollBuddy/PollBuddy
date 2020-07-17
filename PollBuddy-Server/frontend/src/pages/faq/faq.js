import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";

export default class FAQ extends Component {
  
  componentDidMount() {
    this.props.updateTitle("Frequently Asked Questions");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <p className="width-90 fontSizeSmall">
          Hello, world!
        </p>
      </MDBContainer>
    );
  }

}