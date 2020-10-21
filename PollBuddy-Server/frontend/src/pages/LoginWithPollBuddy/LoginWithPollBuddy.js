import React, { Component } from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import "mdbreact/dist/css/mdb.css";
import "./LoginWithPollBuddy.scss";
import { MDBContainer } from "mdbreact";

export default class LoginWithPollBuddy extends Component {

  state = {
    successfulLogin: false,
    error: "",
    email: "",
    password: ""
  };

  constructor(){
    super();
    if(localStorage.getItem("loggedIn")){
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
    // login request to backend
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    }).then(response => {
        if (response.status === 200) {
          //needs some authentication before and if authentication passes then set local storage and such refer to GroupCreation page to see the way to make POST requests to the backend
          localStorage.setItem("loggedIn", true);//maybe have an admin/teacher var instead of just true
          //TODO MAYBE IN THE FUTURE USE COOKIES TO REMEMBER PAST SESSION
          this.setState({successfulLogin: true}); // Tell it to redirect to the next page if successful
        }
        else {
          this.setState({error: "Invalid email/password combination"});
        }
      })
      .catch(err => {
        this.setState({error: "An error occurred during login. Please try again"});
      });
  }

  componentDidMount(){
    this.props.updateTitle("Login With Poll Buddy");
  }
  render() {
    this.handleLogin = this.handleLogin.bind(this); // This is needed so stuff like this.setState works

    if(this.state.successfulLogin) { // Basically redirect if the person is logged in or if their login succeeds
      return (
        <Redirect to="/groups" />
      );
    }
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <label htmlFor="emailText">Email:</label>
            <input type="email" placeholder="sisman@rpi.edu" className="form-control textBox" id="emailText" 
              onChange={(evt) => { this.setState({email: evt.target.value}); }}/>
            <label htmlFor="passwordText">Password:</label>
            <input type="password" placeholder="●●●●●●●●●●●●" className="form-control textBox" id="passwordText"
              onChange={(evt) => { this.setState({password: evt.target.value}); }}/>
          </MDBContainer>

          <button className = "btn button" onClick={this.handleLogin}>Submit</button>

          <a className="Login-link" href = "/register">
            Register
          </a>
          <a className="Login-link" href = "/login/forgot">
            Forgot Password
          </a>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
