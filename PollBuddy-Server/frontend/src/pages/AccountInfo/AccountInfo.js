import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";

import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import {Link} from "react-router-dom";

import "./AccountInfo.scss";

export default class AccountInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {changePassword: false};
    this.changePassword = this.handleToggleClick.bind(this);
  }

  componentDidMount(){
    this.props.updateTitle("Account Info");
  }

  
  handleToggleClick() {
    this.setState(state => ({
      changePassword: !state.changePassword
    }));
  }

  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <h1>Account Settings</h1>
          <MDBContainer>
            <MDBRow className="AccountInfo-accountInputs">
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="firstnameText">First Name:</label>
                <input placeholder="SIS" className="form-control textBox" id="firstnameText" />
              </MDBCol>
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="lastnameText">Last Name:</label>
                <input placeholder="Man" className="form-control textBox" id="lastnameText" />
              </MDBCol>
            </MDBRow>

            <MDBRow className="AccountInfo-accountInputs">
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="usernametext">Username:</label>
                <input value="mans" className="form-control textBox" id="usernametext" readOnly />
              </MDBCol>
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="emailText">Email:</label>
                <input placeholder="sisman@rpi.edu" className="form-control textBox" id="emailText" />
              </MDBCol>
            </MDBRow>

            <MDBRow className="AccountInfo-accountInputs">
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="institution">Institution:</label>
                <input placeholder="RPI" className="form-control textBox" id="institution" readOnly />
              </MDBCol>
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="passwordChange">Password:</label>
                <p id="AccountInfo-passwordChange" onClick={this.changePassword}>{this.state.changePassword ? "Cancel password change" : "Click to change password"}</p>
              </MDBCol>              
            </MDBRow>

            <MDBContainer id="AccountInfo-changePasswordInputs" style={this.state.changePassword ? {display: "flex"} : {display: "none"}}>
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="newPasswordText">New password:</label>
                <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"/>
              </MDBCol>
              <MDBCol md="6" className="AccountInfo-mdbcol-6">
                <label htmlFor="confirmNewPassword">Confirm new password:</label>
                <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmNewPassword"/>
              </MDBCol>
            </MDBContainer>
          </MDBContainer>

          { /* TODO: Update this to have a backend call instead of a "to", plus some result popup */ }
          <div id="AccountInfo-saveChanges">
            <Link to={"/login/forgot"}>
              <button className="button">Save Changes</button>
            </Link>
          </div>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
