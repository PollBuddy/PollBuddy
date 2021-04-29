import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "react-router-dom";
const Joi = require('joi');

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
    };
  }

  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  handleRegister() {
    // do input validation
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp('^(?=.{3,32}$)[a-zA-Z0-9\-._]+$'))
        .error(new Error('Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscore, and dash.')),
      email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2}).max(320)
        .error(new Error('Invalid email format.')),
      password: Joi.string()
        .min(10)
        .max(256)
        .error(new Error('Invalid password. Must contain 10 or more characters, ' +
          'at least 1 uppercase letter, and at least 1 number. ' +
          'Cannot have 4 of the same characters in a row.')),
      firstname: Joi.string()
        .min(1)
        .max(256)
        .error(new Error('First name must be between 1 and 256 characters.')),
      lastname: Joi.string()
        .allow('')
        .max(256)
        .error(new Error('Last name must be less than 256 characters.')),
    });

    var userValid = schema.validate({ username: this.state.username });
    var emailValid = schema.validate({ email: this.state.email });
    var passValid = schema.validate({ password: this.state.password });
    var firstnameValid = schema.validate({ firstname: this.state.firstname});
    var lastnameValid = schema.validate({ lastname: this.state.lastname});

    // disallow more than 4 of the same characters in a row for password
    const passWord = this.state.password;
    var count = 0;
    var lastChara = "";
    for (var i = 0; i < passWord.length; i++){
      if (passWord.charAt(i) === lastChara) {
        count += 1;
        if (count > 4) {
          passValid.error = "Cannot have more than 4 of the same characters in a row.";
          break;
        }
      } else {
        lastChara = passWord.charAt(i);
        count = 1;
      }
    }


    // update component's state
    this.setState({userValid: userValid});
    this.setState({emailValid: emailValid});
    this.setState({passValid: passValid});
    this.setState({emailExists: false});
    this.setState({firstnameValid: firstnameValid});
    this.setState({lastnameValid: lastnameValid});


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
    }).then(response => response.text())
      .then(response => {
        // the backend api (user/register) has three return values:
        // 1. an error array: {firstname: "Invalid firstname format!", lastname: "Invalid lastname format!"}
        // 2. a string: Exists, which means the email address has already been registered
        // 3. status 203: everything is ok

        // print and check the response for debugging (can be deleted later)
        console.log(response);
        if (response === "Exists") {
          this.setState({emailExists: true});
        } else {
          try {
            let result2 = JSON.parse(response);
            console.log("You have following errors:");
            console.log(result2);
          } catch(e) {
            localStorage.setItem("loggedIn", true);
            // redirect to groups page
            this.props.history.push("/groups");
          } 
        }
      });
  }

  render() {
    this.handleRegister = this.handleRegister.bind(this);

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
