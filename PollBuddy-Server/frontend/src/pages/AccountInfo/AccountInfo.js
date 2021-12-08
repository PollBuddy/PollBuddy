import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";

import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import {Link, withRouter} from "react-router-dom";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import "./AccountInfo.scss";
const Joi = require("joi");


class AccountInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      changePassword: false,
      doneLoading: false,
      userName: "mans",
      userNameLoaded: false,
      userNameLocked: false, 
      usernameText: null, 
      firstName: "SIS",
      firstNameLoaded: false,
      firstNameLocked: false,
      firstnameText: null,
      lastName: "Man",
      lastNameLoaded: false,
      lastNameLocked: false,
      lastnameText: null,
      email: "sisman@rpi.edu",
      emailLoaded: false,
      emailLocked: false,
      emailText: null,
      school: "RPI",
      logOutEverywhere: false
    };
    this.changePassword = this.handleToggleClick.bind(this);
    // Bounce back to log in if they are not logged
    if(localStorage.getItem("loggedIn") !== "true"){
      this.props.history.push("/login");
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogOutEverywhere = this.handleLogOutEverywhere.bind(this);
  }

  componentDidMount(){
    this.props.updateTitle("Account Info");
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/me", {
      method: "GET"
    }).then(response => response.json())
      .then(response => {
        // Load states from database values
        const data = JSON.parse(response.data);
        if(data.UserName) {
          this.setState({
            userName: data.UserName,
            userNameLoaded:true,
            userNameLocked: data.UserNameLocked
          });
        }
        if(data.FirstName) {
          this.setState({
            firstName: data.FirstName,
            firstNameLoaded:true,
            firstNameLocked: data.FirstNameLocked
          });
        }
        if(data.LastName) {
          this.setState({
            lastName: data.LastName,
            lastNameLoaded:true,
            lastNameLocked: data.LastNameLocked
          });
        }
        if(data.Email) {
          this.setState({
            email: data.Email,
            emailLoaded:true,
            emailLocked: data.EmailLocked
          });
        }
        if(data.SchoolAffiliation) {
          this.setState({
            school: data.SchoolAffiliation
          });
        }
        if(data.logOutEverywhere) {
          this.setState({
            logOutEverywhere: data.logOutEverywhere 
          });
        }        
        this.setState({
          doneLoading: true
        });
      });
  }
  
  handleToggleClick() {
    this.setState(state => ({
      changePassword: !state.changePassword
    }));
  }

  // Update the input states when inputs change
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const id = target.id;
    this.setState({
      [id]: value
    });
  }

  saveChanges(){
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9\-._]+$"))
        .error(new Error("Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscores, dashes, and periods.")),
      email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2})
        .max(320)
        .error(new Error("Invalid email format.")),
      firstname: Joi.string()
        .min(1).max(256)
        .error(new Error("Invalid first name format.")),
      lastname: Joi.string()
        .allow(" ").max(256)
        .error(new Error("Invalid last name format."))
    });

    var userValid = undefined;
    var userInput = "";
    var emailValid = undefined;
    var emailInput = "";
    var firstNameValid = undefined;
    var firstNameInput = "";
    var lastNameValid = undefined;
    var lastNameInput = "";

    // Ensure that the inputs are valid, if not return
    // Then assign Input value to validated input, or state if the input is not filled in
    if(this.state.usernameText) {
      userValid = schema.validate({username: this.state.usernameText});
      if(userValid.error) {
        return;
      }
      userInput = userValid.value.username;
    } else {
      userInput = this.state.userName;
    }
    if(this.state.firstnameText) {
      firstNameValid = schema.validate({firstname: this.state.firstnameText});
      if(firstNameValid.error) {
        return;
      }
      firstNameInput = firstNameValid.value.firstname;
    } else {
      firstNameInput = this.state.firstName;
    }
    if(this.state.lastnameText) {
      lastNameValid = schema.validate({lastname: this.state.lastnameText});
      if(lastNameValid.error) {
        return;
      }
      lastNameInput = lastNameValid.value.lastname;
    } else {
      lastNameInput = this.state.lastName;
    }
    if(this.state.emailText) {
      emailValid = schema.validate({email: this.state.emailText});
      if(emailValid.error) {
        return;
      }
      emailInput = emailValid.value.email;
    } else {
      emailInput = this.state.email;
    }

    fetch(process.env.REACT_APP_BACKEND_URL + "/users/me/edit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        firstName: firstNameInput, //TODO: keep track of each of the inital states of these
        lastName: lastNameInput,  //only want to put in the changed values
        userName: userInput,
        email: emailInput,
        password: undefined,
        logOutEverywhere: this.state.logOutEverywhere
      })
    }).then(response => {
      console.log(response);
    });
  }

  handleLogOutEverywhere(){
    this.setState(state => ({
      logOutEverywhere: !state.logOutEverywhere
    }));
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/me/edit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: {
        password: this.state.password, // TODO: needs to be verified to function
        logOutEverywhere: this.state.logOutEverywhere
      }
    }).then(response => {
      console.log(response);
    });
  }

  render() {
    if(!this.state.doneLoading){
      return ( 
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="box">
            <h1>Account Settings</h1>
            <MDBContainer>
              <MDBRow className="AccountInfo-accountInputs">
                <MDBCol md="6" className="AccountInfo-mdbcol-6">
                  <label htmlFor="firstnameText">First Name:</label>
                  <input placeholder={this.state.firstName} defaultValue={this.state.firstNameLoaded ? this.state.firstName : undefined } className="form-control textBox" id="firstnameText" readOnly={this.state.firstNameLocked} onChange={this.handleInputChange}/>
                </MDBCol>
                <MDBCol md="6" className="AccountInfo-mdbcol-6">
                  <label htmlFor="lastnameText">Last Name:</label>
                  <input placeholder={this.state.lastName} defaultValue={this.state.lastNameLoaded ? this.state.lastName : undefined } className="form-control textBox" id="lastnameText" readOnly={this.state.lastNameLocked} onChange={this.handleInputChange}/>
                </MDBCol>
              </MDBRow>
  
              <MDBRow className="AccountInfo-accountInputs">
                <MDBCol md="6" className="AccountInfo-mdbcol-6">
                  <label htmlFor="usernameText">Username:</label>
                  <input value={this.state.userName} className="form-control textBox" id="usernameText" readOnly={this.state.userNameLocked} onChange={this.handleInputChange}/>
                </MDBCol>
                <MDBCol md="6" className="AccountInfo-mdbcol-6">
                  <label htmlFor="emailText">Email:</label>
                  <input placeholder={this.state.email} defaultValue={this.state.emailLoaded ? this.state.email : undefined } className="form-control textBox" id="emailText" readOnly={this.state.emailLocked} onChange={this.handleInputChange}/>
                </MDBCol>
              </MDBRow>
  
              <MDBRow className="AccountInfo-accountInputs">
                <MDBCol md="6" className="AccountInfo-mdbcol-6">
                  <label htmlFor="institution">Institution:</label>
                  <input placeholder="RPI" className="form-control textBox" id="institution" value={this.state.school} readOnly />
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

            <div id="AccountInfo-logOutEverywhere" style={this.state.changePassword ? {display: "flex"} : {display: "none"}}>
              <input type="checkbox" onChange={this.handleLogOutEverywhere} className="logOutBox" id="logOutEverywhere" checked={this.logOutEverywhere}/>
              <label className="logOutLabel" for="logOutEverywhere">Log out everywhere?</label>
            </div>
          
            { /* TODO: Update this to have a backend call instead of a "to", plus some result popup */ }
            <Link id="AccountInfo-saveChanges" onClick={ () => this.saveChanges()}>
              <button className="button">Save Changes</button>
            </Link>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}

export default withRouter(AccountInfo);
