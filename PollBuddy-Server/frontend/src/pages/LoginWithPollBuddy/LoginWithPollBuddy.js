import React, { Component } from "react";
import {Navigate} from "react-router-dom";
import "mdbreact/dist/css/mdb.css";
import "./LoginWithPollBuddy.scss";
import { MDBContainer } from "mdbreact";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
const Joi = require("joi");

class LoginWithPollBuddy extends Component {

  
  constructor(props){
    super(props);
    let prevRoute = "/";
    if (props.router.location.state && props.router.location.state.prevRoute) {
      prevRoute = props.router.location.state.prevRoute;
    }
    this.state = {
      successfulLogin: false,
      prevRoute,
      error: "",
      numLoginAttempts: 0,
      userNameEmail: "",
      password: ""
    };
    if(localStorage.getItem("loggedIn") === "true"){
      this.setState({successfulLogin: true}); // Tell it to redirect to the next page if already logged in
    }
    console.log(process.env.REACT_APP_BACKEND_URL);
    fetch(process.env.REACT_APP_BACKEND_URL + "/groups", {
      method: "GET",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
    }).then(response => response.json())
      // handle response
      .then(data => {
        console.log("Yoo we got data :D");
        console.log(data);
      })
      .catch(err => {
        this.setState({error: "An error occurred during login. Please try again"});
      });
  }
  handleLogin() {
    const schema = Joi.object({
      username: Joi.string()
        .pattern(new RegExp("^(?=.{3,32}$)[a-zA-Z0-9-._]+$"))
        .error(new Error("Please enter a valid username or email.")),
      email: Joi.string().email({ tlds: {allow: false}, minDomainSegments: 2}).max(320)
        .error(new Error("Please enter a valid username or email.")),
      password: Joi.string()
        .pattern(new RegExp("^(?=.{10,256})(?:(.)(?!\\1\\1\\1))*$"))
        .pattern(new RegExp("^.*[0-9].*$"))
        .pattern(new RegExp("^.*[A-Z].*$"))
        .error(new Error("Please enter a valid password.")),
    });
    //we need to validate each separately because either username or email could work
    const validUsername = schema.validate({ username: this.state.userNameEmail });
    const validEmail = schema.validate({ email: this.state.userNameEmail });
    const validPassword = schema.validate({ password: this.state.password });

    //error in username/email
    if(validUsername.error && validEmail.error){
      this.setState({error: validUsername.error.toString()});
      return;
    }
    //error in password
    if(validPassword.error){
      this.setState({error:validPassword.error.toString()});
      return;
    }
    //no errors
    this.setState({error: ""});

    // login request to backend
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userNameEmail: this.state.userNameEmail,
        password: this.state.password
      })
    }).then(response => {
      if (response.status === 200) {
        //needs some authentication before and if authentication passes then set local storage and such refer to GroupCreation page to see the way to make POST requests to the backend
        localStorage.setItem("loggedIn", "true");//maybe have an admin/teacher var instead of just true
        this.setState({successfulLogin: true}); // Tell it to redirect to the next page if successful
      } else {
        this.setState({error: "Invalid username/email and password combination"});
        this.setState({numLoginAttempts: this.state.numLoginAttempts + 1});
        if (this.state.numLoginAttempts >= 5) { // If too many login attempts, offer to reset password
          this.setState({error: this.state.error + "\nForgot your password? Try clicking \"Forgot Password?\" to reset your password."});
        }
      }
    }).catch(err => {
      console.log(err);
      this.setState({error: "An error occurred during login. Please try again"});
    });
  }

  componentDidMount(){
    this.props.updateTitle("Login With Poll Buddy");
  }

  render() {
    this.handleLogin = this.handleLogin.bind(this); // This is needed so stuff like this.setState works
    if(this.state.successfulLogin) { // Basically redirect if the person is logged in or if their login succeeds
      let route = "";
      if (this.state.prevRoute) {
        route += this.state.prevRoute;
      }
      return (
        <Navigate to={route} push={true}/>
      );
    }
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <label htmlFor="userNameEmail">Username or Email:</label>
            <input type="userNameEmail" placeholder="sisman@rpi.edu" className="form-control textBox" id="userNameEmail"
              onChange={(evt) => { this.setState({userNameEmail: evt.target.value}); }}/>
            <label htmlFor="password">Password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="password"
              onChange={(evt) => { this.setState({password: evt.target.value}); }}/>
          </MDBContainer>

          <p style={{color: "red"}}>{ this.state.error }</p>
          <button className = "button" onClick={this.handleLogin}>Submit</button>

          <a className="Login-link" href = "/register">
            Register
          </a>
          <a className="Login-link" href = "/login/forgot">
            Forgot Password?
          </a>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(LoginWithPollBuddy);
