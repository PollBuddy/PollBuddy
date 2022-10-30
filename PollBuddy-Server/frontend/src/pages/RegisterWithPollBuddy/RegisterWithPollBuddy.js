import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Navigate} from "react-router-dom";
import "./RegisterWithPollBuddy.scss";

const Joi = require("joi");

export default class RegisterWithPollBuddy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      userValid: true,
      emailValid: true,
      emailExists: false,
      passValid: true,
      firstnameValid: true,
      lastnameValid: true,
      registrationSuccessful: false,
      showPassword: false
    };
  }

  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  showPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  handleRegister = async () => {
    // do input validation
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9-._]+$"))
        .error(new Error("Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscores, dashes, and periods.")),
      email: Joi.string().email({tlds: {allow: false}, minDomainSegments: 2})
        .max(320)
        .error(new Error("Invalid email format.")),
      password: Joi.string()
        .pattern(new RegExp("^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$"))
        .pattern(new RegExp("^.*[0-9].*$"))
        .pattern(new RegExp("^.*[A-Z].*$"))
        .error(new Error("Invalid password. Must contain 10 or more characters, " +
          "at least 1 uppercase letter, and at least 1 number. " +
          "Cannot have 4 of the same characters in a row.")),
      firstname: Joi.string()
        .min(1)
        .max(256)
        .error(new Error("First name must be between 1 and 256 characters.")),
      lastname: Joi.string()
        .allow("")
        .max(256)
        .error(new Error("Last name must be less than 256 characters.")),
    });

    const userValid = schema.validate({username: this.state.username});
    const emailValid = schema.validate({email: this.state.email});
    const passValid = schema.validate({password: this.state.password});
    const firstnameValid = schema.validate({firstname: this.state.firstname});
    const lastnameValid = schema.validate({lastname: this.state.lastname});

    // update component's state
    this.setState({
      userValid: userValid,
      emailValid: emailValid,
      emailExists: false,
      passValid: passValid,
      firstnameValid: firstnameValid,
      lastnameValid: lastnameValid
    });

    if (userValid.error || emailValid.error || passValid.error || lastnameValid.error || firstnameValid.error) {
      return;
    }

    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        userName: this.state.username.toLowerCase(),
        email: this.state.email.toLowerCase(),
        password: this.state.password
      })
    });
    let response = await httpResponse.json();
    if (response.result === "success") {
      //needs some authentication before and if authentication passes then set local storage and such refer to GroupCreation page to see the way to make POST requests to the backend
      localStorage.setItem("loggedIn", "true");
      this.setState({registrationSuccessful: true});
      // TODO: firstName, lastName, and userName are returned. They should probably be stored.
    } else {
      // TODO: This needs to be handled
    }
  };

  render() {
    if (this.state.registrationSuccessful) {
      return (
        <Navigate to="/groups"/>
      );
    }
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Register with Poll Buddy
          </p>
          <p>
            To create an account, fill in the text boxes, then press submit.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="firstnameText">First Name:</label>
            <input placeholder="Your first name" className="form-control textBox" id="firstnameText"
              onChange={(evt) => {
                this.setState({firstname: evt.target.value});
              }}/>
            {this.state.firstnameValid.error &&
              <p style={{color: "red"}}>{this.state.firstnameValid.error.toString()}</p>
            }
            <label htmlFor="lastnameText">Last Name:</label>
            <input placeholder="Your last name" className="form-control textBox" id="lastnameText"
              onChange={(evt) => {
                this.setState({lastname: evt.target.value});
              }}/>
            {this.state.lastnameValid.error &&
              <p style={{color: "red"}}>{this.state.lastnameValid.error.toString()}</p>
            }
            <label htmlFor="usernameText">Username:</label>
            <input placeholder="Your username" className="form-control textBox" id="usernameText"
              onChange={(evt) => {
                this.setState({username: evt.target.value});
              }}/>
            {this.state.userValid.error &&
              <p style={{color: "red"}}>{this.state.userValid.error.toString()}</p>
            }
            <label htmlFor="emailText">Email:</label>
            <input placeholder="Your email address" className="form-control textBox" id="emailText"
              onChange={(evt) => {
                this.setState({email: evt.target.value});
              }}/>
            {this.state.emailValid.error &&
              <p style={{color: "red"}}>{this.state.emailValid.error.toString()}</p>
            }
            {this.state.emailExists &&
              <p style={{color: "red"}}> A user with this email already exists. </p>
            }
            <label htmlFor="passwordText">Password:</label>
            <p class="password_container">
              <input type={this.state.showPassword ? "text" : "password"} placeholder="••••••••••••"
                className="form-control textBox" id="passwordText"
                onChange={(evt) => {
                  this.setState({password: evt.target.value});
                }}/>
              <i class="fas fa-eye" onClick={this.showPassword}></i>
            </p>

            {this.state.passValid.error &&
              <p style={{color: "red"}}>{this.state.passValid.error.toString()}</p>
            }
          </MDBContainer>
          <button className="button" onClick={this.handleRegister}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
