import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import "./RegisterWithPollBuddy.scss";
import {withRouter} from "react-router-dom";

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
    const userValid = new RegExp(/^[a-zA-Z0-9_.-]{3,32}$/).test(this.state.username);
    const emailValid = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(this.state.email);
    var passValid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,256}$/)
      .test(this.state.password);
    const firstnameValid = new RegExp(/^[a-zA-Z]{1,256}$/).test(this.state.firstname);
    const lastnameValid = new RegExp(/^[a-zA-Z]{0,256}$/).test(this.state.lastname);

    // disallow more than 4 of the same characters in a row for password
    const passWord = this.state.password;
    var count = 0;
    var lastChara = "";
    for (var i = 0; i < passWord.length; i++){
      if (passWord.charAt(i) === lastChara) {
        count += 1;
        if (count > 4) {
          passValid = false;
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


    if (!userValid || !emailValid || !passValid || !firstnameValid || !firstnameValid) {
      return;
    }

    fetch(process.env.REACT_APP_BACKEND_URL + "/users/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        FirstName: this.state.firstname,
        LastName: this.state.lastname,
        Username: this.state.username.toLowerCase(),
        Email: this.state.email.toLowerCase(),
        Password: this.state.password
      })
    })
      .then(response => response.text())
      .then(response => {
        // email already exists in database, don't login
        if (response === "Exists") {
          this.setState({emailExists: true});
        } else {
          localStorage.setItem("loggedIn", true);
          // redirect to groups page
          this.props.history.push("/groups");
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
            {!this.state.firstnameValid &&
              <ul className="error">
                <li>First name must be between 1 and 256 characters</li>
              </ul>
            }
            <label htmlFor="lastnameText">Last Name:</label>
            <input placeholder="Man" className="form-control textBox" id="lastnameText"
              onChange={(evt) => { this.setState({lastname: evt.target.value}); }}/>
            {!this.state.lastnameValid &&
              <ul className="error">
                <li>Last name must be less than 256 characters</li>
              </ul>
            }
            <label htmlFor="usernameText">Username:</label>
            <input placeholder="mans" className="form-control textBox" id="usernameText"
              onChange={(evt) => { this.setState({username: evt.target.value}); }}/>
            {!this.state.userValid &&
              <ul className="error">
                <li>Username must be between 3 and 32 characters</li>
                <li>Valid characters: a-z0-9-_ (alphanumeric + underscore + dash)</li>
              </ul>
            }
            <label htmlFor="emailText">Email:</label>
            <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"
              onChange={(evt) => { this.setState({email: evt.target.value}); }}/>
            {!this.state.emailValid &&
              <ul className="error">
                <li>Invalid email format!</li>
              </ul>
            }
            {this.state.emailExists && <div className="error">A user with this email already exists!</div>}
            <label htmlFor="passwordText">Password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="passwordText"
              onChange= {(evt) => { this.setState({password: evt.target.value}); }}/>
            {!this.state.passValid &&
              <ul className="error">
                <li>Invalid password. Must contain:</li>
                <li>10 or more characters</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 number</li>
              </ul>
            }
          </MDBContainer>
          <button className="button" onClick={this.handleRegister}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(RegisterWithPollBuddy);
