import React, { Component } from "react";
import {Link, Redirect} from "react-router-dom";
import "mdbreact/dist/css/mdb.css";
import "./login.scss"
import { MDBContainer } from "mdbreact";

export default class login extends Component {

  state = {
    successfulLogin: false
  };

  constructor(){
    super();
    if(localStorage.getItem("loggedIn")){
      this.setState({successfulLogin: true}) // Tell it to redirect to the next page if already logged in
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
        this.setState({error: "An error occurred during login. Please try again"})
      });
  }
  handleLogin() {
    //needs some authentication before and if authentication passes then set local storage and such refer to classcreation page to see the way to make POST requests to the backend
    localStorage.setItem("loggedIn", true);//maybe have an admin/teacher var instead of just true
    //TODO MAYBE IN THE FUTURE USE COOKIES TO REMEMBER PAST SESSION
    this.setState({successfulLogin: true}) // Tell it to redirect to the next page if successful
  }

  componentDidMount(){
    this.props.updateTitle("Log in");
  }
  render() {
    this.handleLogin = this.handleLogin.bind(this); // This is needed so stuff like this.setState works

    if(this.state.successfulLogin) { // Basically redirect if the person is logged in or if their login succeeds
      return (
        <Redirect to="/myClasses" />
      )
    }
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <p>
            <b>Email:</b>
          </p>
          <MDBContainer className="form-group">
            <input type="email" placeholder="sisman@rpi.edu" className="form-control textBox"/>
          </MDBContainer>

          <p>
            <b>Password:</b>
          </p>
          <MDBContainer className="form-group">
            <input type="password" placeholder="••••••••••••••" className="form-control textBox"/>
          </MDBContainer>

          <Link to={"/myclasses"}>
            <button className = "btn button">Submit</button>
          </Link>

          <a className="login_link" href = "/registerDefault">
            Register
          </a>
          <a className="login_link" href = "/forgotPassword">
            Forgot Password
          </a>
        </MDBContainer>
      </MDBContainer>
    )
  }
}
