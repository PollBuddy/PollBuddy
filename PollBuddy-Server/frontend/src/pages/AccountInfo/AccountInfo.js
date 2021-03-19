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
          <h1>Account Settings</h1>
          <MDBContainer className="form-group">
            <label htmlFor="firstnameText">First Name:</label>
            <input placeholder="SIS" className="form-control textBox" id="firstnameText"/>
            <label htmlFor="lastnameText">Last Name:</label>
            <input placeholder="Man" className="form-control textBox" id="lastnameText"/>
            <label htmlFor="usernametext">Username:</label>
            <input placeholder="mans" className="form-control textBox" id="usernametext" readOnly/>
            <label htmlFor="emailText">Email:</label>
            <input placeholder="sisman@rpi.edu" className="form-control textBox" id="emailText"/>

            { /* TODO: Hide these until the user clicks the change password button below */ }
            <label htmlFor="newPasswordText">New password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"/>
            <label htmlFor="confirmNewPassword">Confirm new password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmNewPassword"/>
            <label htmlFor="currentPasswordText">Verify changes with current password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="currentPasswordText"/>
          </MDBContainer>

          <Link to={"/login/forgot"}>
            <button className="button">Change password</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
