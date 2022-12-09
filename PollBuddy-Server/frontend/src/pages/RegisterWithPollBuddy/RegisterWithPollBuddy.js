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
      confirm: "",
      confValid: true,
      registrationSuccessful: false,
      showPassword: false,
      showConfrm: false,
      error: null,
    };

    this.showPassword = this.showPassword.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
  }

  showPassword() {
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  showConfirm() {
    this.setState({
      showConfirm: !this.state.showConfirm
    });
  }

  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  checkPswd(pswd) {
    this.setState({
      req1: /^.{10,256}$/.test(pswd),
      req2: /^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$/.test(pswd),
      req3: /^.*[0-9].*$/.test(pswd),
      req4: /^.*[A-Z].*$/.test(pswd),
    });
  }

  handleRegister(event) {
    event.preventDefault();
    // do input validation
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9-._]+$"))
        .error(new Error("Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscores, dashes, and periods.")),
      email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2})
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
      confirm: Joi.string()
        .equal(this.state.password)
        .error(new Error("The confirmation password must equal the password.")),
    });

    const userValid = schema.validate({username: this.state.username});
    const emailValid = schema.validate({ email: this.state.email });
    const passValid = schema.validate({ password: this.state.password });
    const firstnameValid = schema.validate({ firstname: this.state.firstname});
    const lastnameValid = schema.validate({ lastname: this.state.lastname});
    const confirmValid = schema.validate({ confirm: this.state.confirm});

    // update component's state
    this.setState({
      userValid: userValid,
      emailValid: emailValid,
      emailExists: false,
      passValid: passValid,
      firstnameValid: firstnameValid,
      lastnameValid: lastnameValid,
      confValid: confirmValid,
      error: null,
    });


    if (userValid.error || emailValid.error || passValid.error || lastnameValid.error || firstnameValid.error || confirmValid.error) {
      return false;
    }

    fetch(process.env.REACT_APP_BACKEND_URL + "/users/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        userName: this.state.username.toLowerCase(),
        email: this.state.email.toLowerCase(),
        password: this.state.password
      })
    }).then(response => {
      if (response.status === 200) {
        //needs some authentication before and if authentication passes then set local storage and such refer to GroupCreation page to see the way to make POST requests to the backend
        localStorage.setItem("loggedIn", "true");
        this.setState({registrationSuccessful: true});
        // TODO: firstName, lastName, and userName are returned. They should probably be stored.
      } else {
        // TODO: This needs to be handled
        response.json().then(({ error }) => {
          this.setState({ error });
        });
      }
    }).catch(err => {
      // console.log(err);
      this.setState({error: "An error occurred during login. Please try again"});
    });

    return false;
  }

  render() {
    this.handleRegister = this.handleRegister.bind(this);

    if(this.state.registrationSuccessful) {
      return (
        <Navigate to="/groups" />
      );
    }

    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <form action="#" method="post" onSubmit={this.handleRegister}>
          <p className="fontSizeLarge">
            Register with Poll Buddy
          </p>
          <p>
            To create an account, fill in the text boxes, then press submit.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="firstnameText">First Name:</label>
            <input placeholder="Your first name" className="form-control textBox" id="firstnameText"
              tabIndex="1" onChange={(evt) => { this.setState({firstname: evt.target.value}); }} required/>
            {this.state.firstnameValid.error &&
              <p style={{color: "red"}}>{ this.state.firstnameValid.error.toString() }</p>
            }
            <label htmlFor="lastnameText">Last Name:</label>
            <input placeholder="Your last name" className="form-control textBox" id="lastnameText"
              tabIndex="2" onChange={(evt) => { this.setState({lastname: evt.target.value}); }} required/>
            {this.state.lastnameValid.error &&
              <p style={{color: "red"}}>{ this.state.lastnameValid.error.toString() }</p>
            }
            <label htmlFor="usernameText">Username:</label>
            <input placeholder="Your username" className="form-control textBox" id="usernameText"
              tabIndex="3" onChange={(evt) => { this.setState({username: evt.target.value}); }} required/>
            {this.state.userValid.error &&
              <p style={{color: "red"}}>{ this.state.userValid.error.toString() }</p>
            }
            <label htmlFor="emailText">Email:</label>
            <input placeholder="Your email address" className="form-control textBox" id="emailText"
              tabIndex="4" onChange={(evt) => { this.setState({email: evt.target.value}); }} required/>
            {this.state.emailValid.error &&
              <p style={{color: "red"}}>{ this.state.emailValid.error.toString() }</p>
            }
            {this.state.emailExists &&
              <p style={{color: "red"}}> A user with this email already exists. </p>
            }
            <label htmlFor="passwordText">Password:</label>
            <p class="password_container">
              <input type={this.state.showPassword ? "text" : "password"} placeholder="••••••••••••" className="form-control textBox" id="passwordText"
                tabIndex="5" onChange= {(evt) => { this.setState({password: evt.target.value}); this.checkPswd(evt.target.value); }} required/>
              <i class="fas fa-eye" onClick={this.showPassword}>{this.state.showPassword ? "Hide" : "Show"}</i>
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "start", marginLeft: "20px" }}>
              <label style={{ fontWeight: "normal", margin: "0", border: "0", padding: "0", pointerEvents: "none" }}><input type="checkbox" checked={this.state.req1}/>&nbsp;&nbsp;Must be alteast 10 characters long.</label>
              <label style={{ fontWeight: "normal", margin: "0", border: "0", padding: "0", pointerEvents: "none" }}><input type="checkbox" checked={this.state.req2}/>&nbsp;&nbsp;Must not have 4 same characters in row.</label>
              <label style={{ fontWeight: "normal", margin: "0", border: "0", padding: "0", pointerEvents: "none" }}><input type="checkbox" checked={this.state.req3}/>&nbsp;&nbsp;Must contain a digit.</label>
              <label style={{ fontWeight: "normal", margin: "0", border: "0", padding: "0", pointerEvents: "none" }}><input type="checkbox" checked={this.state.req4}/>&nbsp;&nbsp;Must contain a capital number.</label>
            </div>

            <label htmlFor="confirmText">Confirm Password:</label>
            <p class="password_container">
              <input type={this.state.showConfirm ? "text" : "password"} placeholder="••••••••••••" className="form-control textBox" id="confirmText"
                tabIndex="6" onChange= {(evt) => { this.setState({confirm: evt.target.value}); }} required/>
              <i class="fas fa-eye" onClick={this.showConfirm}>{this.state.showConfirm ? "Hide" : "Show"}</i>
            </p>
            {this.state.confValid.error &&
              <p style={{color: "red"}}>{ this.state.confValid.error.toString() }</p>
            }
            <button className="button" onClick={this.handleRegister}>Submit</button>
            {this.state.error &&
              <p style={{color: "red"}}>{ this.state.error.toString() }</p>
            }
          </MDBContainer>
          </form>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
