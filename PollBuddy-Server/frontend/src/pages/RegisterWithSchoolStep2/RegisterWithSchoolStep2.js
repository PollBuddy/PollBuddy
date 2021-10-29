import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "react-router-dom";
import ErrorText from "../../components/ErrorText/ErrorText";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
const Joi = require('joi');

class RegisterWithSchoolStep2 extends Component {
  constructor(props) {
    super(props);

    // Process args
    if(this.props.location.search) {
      console.log("Getting things");
      var firstName = new URLSearchParams(this.props.location.search).get("firstName");
      var firstNamePrefilled = true;
      var lastName = new URLSearchParams(this.props.location.search).get("lastName");
      var lastNamePrefilled = true;
      var userName = new URLSearchParams(this.props.location.search).get("userName");
      var userNamePrefilled = true;
      var email = new URLSearchParams(this.props.location.search).get("email");
      var emailPrefilled = true;

      if(firstName == null) { firstName = ""; firstNamePrefilled = false; }
      if(lastName == null) { lastName = ""; lastNamePrefilled = false; }
      if(userName == null) { userName = ""; userNamePrefilled = false; }
      if(email == null) { email = ""; emailPrefilled = false; }
    }

    // Set up the state
    this.state = {
      firstName: firstName,
      firstNamePrefilled: firstNamePrefilled,
      lastName: lastName,
      lastNamePrefilled: lastNamePrefilled,
      userName: userName,
      userNamePrefilled: userNamePrefilled,
      email: email,
      emailPrefilled: emailPrefilled,
      userNameValid: true,
      emailValid: true,
      emailExists: false,
      firstNameValid: true,
      lastNameValid: true,
      error: null,
      doneLoading: true,
    };

  }

  componentDidMount() {
    this.props.updateTitle("Register with School");
    console.log(this.state);
  }

  handleRegister() {
    // do input validation
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp('^(?=.{3,32}$)[a-zA-Z0-9\-._]+$'))
        .error(new Error('Username must be between 3 and 32 characters. Valid characters include letters, numbers, underscores, dashes, and periods.')),
      email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2}).max(320)
        .error(new Error('Invalid email format.')),
      firstname: Joi.string()
        .min(1)
        .max(256)
        .error(new Error('First name must be between 1 and 256 characters.')),
      lastname: Joi.string()
        .allow('')
        .max(256)
        .error(new Error('Last name must be less than 256 characters.')),
    });
    var userNameValid = schema.validate({ username: this.state.username });
    var emailValid = schema.validate({ email: this.state.email });
    var firstNameValid = schema.validate({ firstname: this.state.firstname});
    var lastNameValid = schema.validate({ lastname: this.state.lastname});


    // Update component's state
    this.setState({
      firstNameValid: firstNameValid,
      lastNameValid: lastNameValid,
      userNameValid: userNameValid,
      emailValid: emailValid,
      emailExists: false
    });

    if (userNameValid.error || emailValid.error || lastNameValid.error || firstNameValid.error) {
      return;
    }

    // If all are valid, submit a request to the backend to do the registration
    // TODO: This URL is going to need to be fixed and made dynamic
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/register/rpi", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        userName: this.state.userName,
        email: this.state.email,
      })
    }).then(response => response.json())
      .then(response => {

        // TODO: Debug print, delete
        console.log(response);
        if (response != null) {
          if (response.result === "success") {
            // Save data about the user
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("lastName", response.data.lastName);
            localStorage.setItem("userName", response.data.userName);
            // Redirect to groups page
            return <Redirect to="/groups" push={true}/>;
          } else {
            // Something went wrong, handle it

            if (response.error === "Validation failed") {
              this.setState({error: response.data.errors});
            } else {
              this.setState({error: response.error});
            }
            console.log("ERROR: " + this.state.error);

          }
        }
      });
  }

  render() {
    this.handleRegister = this.handleRegister.bind(this);
    if (this.state.error != null) {
      return (
        <ErrorText text={this.state.error}> </ErrorText>
      );
    } else if(!this.state.doneLoading){
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {

      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Register with School
            </p>
            <p>
              To finish creating your account, fill in the text boxes, then press submit.
            </p>
            <MDBContainer className="form-group">

              <label htmlFor="firstnameText">First Name:</label>
              <input placeholder="SIS" className="form-control textBox" id="firstnameText"
                value={this.state.firstName} readOnly={this.state.firstNamePrefilled}
                onChange={(evt) => {
                  this.setState({firstName: evt.target.value});
                }}
              />
              {this.state.firstNameValid.error &&
                <p style={{color: "red"}}>{ this.state.firstNameValid.error.toString() }</p>
              }
              <label htmlFor="lastnameText">Last Name:</label>
              <input placeholder="Man" className="form-control textBox" id="lastnameText"
                value={this.state.lastName} readOnly={this.state.lastNamePrefilled}
                onChange={(evt) => {
                  this.setState({lastName: evt.target.value});
                }}
              />
              {this.state.lastNameValid.error &&
                <p style={{color: "red"}}>{ this.state.lastNameValid.error.toString() }</p>
              }
              <label htmlFor="usernameText">Username:</label>
              <input placeholder="mans" className="form-control textBox" id="usernameText"
                value={this.state.userName} readOnly={this.state.userNamePrefilled}
                onChange={(evt) => {
                  this.setState({userName: evt.target.value});
                }}
              />
              {this.state.userNameValid.error &&
                <p style={{color: "red"}}>{ this.state.userNameValid.error.toString() }</p>
              }
              <label htmlFor="emailText">Email:</label>
              <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText" value={this.state.email} readOnly={this.state.emailPrefilled} onChange={(evt) => {
                this.setState({email: evt.target.value});
              }}/>
              {this.state.emailValid.error &&
                <p style={{color: "red"}}>{ this.state.emailValid.error.toString() }</p>
              }
              {this.state.emailExists &&
                <p style={{color: "red"}}>A user with this email already exists!</p>
              }

            </MDBContainer>
            <button className="button" onClick={this.handleRegister}>Submit</button>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}

export default withRouter(RegisterWithSchoolStep2);
