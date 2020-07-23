import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";

export default class Contact extends Component {

  componentDidMount() {
    this.props.updateTitle("Contact Us");
  }

  render() {
    return(
      <MDBContainer fluid className="page">
        <p className="width-90 fontSizeSmall">Hello, world!</p>
        <a href = "mailto:contactus@pollbuddy.app">
          Contact
        </a>
      </MDBContainer>
    );
  }
  
}