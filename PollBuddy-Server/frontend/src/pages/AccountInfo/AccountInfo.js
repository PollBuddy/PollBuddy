import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

export default class AccountInfo extends Component {
  componentDidMount(){
    this.props.updateTitle("Account Info");
  }

  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <label htmlFor="nameText">Name:</label>
            <input placeholder="SIS Man" className="form-control textBox" id="nameText"/>
            <label htmlFor="emailText">Email:</label>
            <input placeholder="sisman@rpi.edu" className="form-control textBox" id="emailText"/>
            <label htmlFor="newPasswordText">New password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"/>
            <label htmlFor="confirmNewPassword">Confirm new password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmNewPassword"/>
            <label htmlFor="currentPasswordText">Verify changes with current password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="currentPasswordText"/>
          </MDBContainer>
          <Link to={"/myclasses"}>
            <button className="btn button">Submit</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
