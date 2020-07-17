import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

export default class accountinfo extends Component {
  componentDidMount(){
    this.props.updateTitle("Account Info");
  }

  render() {
    return (
      <MDBContainer className="page">
        <p className="fontSizeSmall">
          <label htmlFor="nameText">Name:</label>
        </p>
        <MDBContainer className="form-group">
          <input placeholder="SIS Man" className="form-control textBox" id="nameText"/>
        </MDBContainer>

        <p className="fontSizeSmall">
          <label htmlFor="emailText">Email:</label>
        </p>
        <MDBContainer className="form-group">
          <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"/>
        </MDBContainer>
        <p className="fontSizeSmall">
          <label htmlFor="currentPasswordText">Current password:</label>
        </p>
        <MDBContainer className="form-group">
          <input placeholder="shir1ey-is-my-gir1y" className="form-control textBox" id="currentPasswordText"/>
        </MDBContainer>

        <p className="fontSizeSmall">
          <label htmlFor="confirmPassworkText">Confirm password:</label>
        </p>
        <MDBContainer className="form-group">
          <input placeholder="shir1ey-is-my-gir1y" className="form-control textBox" id="confirmPassworkText"/>
        </MDBContainer>
        <Link to={"/myclasses"}>
          <button className="btn button">Submit</button>
        </Link>
      </MDBContainer>
    )
  }
}
