import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Redirect, withRouter} from "react-router-dom";
const Joi = require("joi");

class RegisterWithPollBuddy extends Component {
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
      registrationSuccessful: false
    };
  }

  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  handleRegister() {
    // do input validation
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9\-._]+$"))
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
    });

    var userValid = schema.validate({ username: this.state.username });
    var emailValid = schema.validate({ email: this.state.email });
    var passValid = schema.validate({ password: this.state.password });
    var firstnameValid = schema.validate({ firstname: this.state.firstname});
    var lastnameValid = schema.validate({ lastname: this.state.lastname});

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
        localStorage.setItem("loggedIn", true);
        this.setState({registrationSuccessful: true});
        // TODO: firstName, lastName, and userName are returned. They should probably be stored.
      } else {
        // TODO: This needs to be handled
      }
    }).catch(err => {
      console.log(err);
      this.setState({error: "An error occurred during login. Please try again"});
    });
  }

  render() {
    this.handleRegister = this.handleRegister.bind(this);

    if(this.state.registrationSuccessful) {
      return (
        <Redirect to="/groups" />
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
            <input placeholder="SIS" className="form-control textBox" id="firstnameText"
              onChange={(evt) => { this.setState({firstname: evt.target.value}); }}/>
            {this.state.firstnameValid.error &&
              <p style={{color: "red"}}>{ this.state.firstnameValid.error.toString() }</p>
            }
            <label htmlFor="lastnameText">Last Name:</label>
            <input placeholder="Man" className="form-control textBox" id="lastnameText"
              onChange={(evt) => { this.setState({lastname: evt.target.value}); }}/>
            {this.state.lastnameValid.error &&
              <p style={{color: "red"}}>{ this.state.lastnameValid.error.toString() }</p>
            }
            <label htmlFor="usernameText">Username:</label>
            <input placeholder="mans" className="form-control textBox" id="usernameText"
              onChange={(evt) => { this.setState({username: evt.target.value}); }}/>
            {this.state.userValid.error &&
              <p style={{color: "red"}}>{ this.state.userValid.error.toString() }</p>
            }
            <label htmlFor="emailText">Email:</label>
            <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"
              onChange={(evt) => { this.setState({email: evt.target.value}); }}/>
            {this.state.emailValid.error &&
              <p style={{color: "red"}}>{ this.state.emailValid.error.toString() }</p>
            }
            {this.state.emailExists &&
              <p style={{color: "red"}}> A user with this email already exists. </p>
            }
            <label htmlFor="passwordText">Password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="passwordText"
              onChange= {(evt) => { this.setState({password: evt.target.value}); }}/>
            {this.state.passValid.error &&
              <p style={{color: "red"}}>{ this.state.passValid.error.toString() }</p>
            }
          </MDBContainer>
          <button className="button" onClick={this.handleRegister}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(RegisterWithPollBuddy);
