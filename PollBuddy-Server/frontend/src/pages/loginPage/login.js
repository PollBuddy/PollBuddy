import React, { Component } from "react";
import {Link, Redirect} from "react-router-dom";
import "mdbreact/dist/css/mdb.css";
import "./login.scss"
import { MDBContainer } from "mdbreact";

export default class login extends Component {
  constructor(){
    super();
    if(localStorage.getItem("loggedIn")){
      Redirect("/myclasses");//this redirects users to the route absolute specified.
    }
  }
  handleLogin() {
    //needs some authentication before and if authentication passes then set local storage and such refer to classcreation page to see the way to make POST requests to the backend
    localStorage.setItem("loggedIn", true);//maybe have an admin/teacher var instead of just true
    //TODO MAYBE IN THE FUTURE USE COOKIES TO REMEMBER PAST SESSION
    Redirect("/myclasses");//this is how one navigates to another page from reach router
  }
  componentDidMount(){
    this.props.updateTitle("Log in");
  }
  render() {
    return (
      <MDBContainer className="page">

        <p className="bold fontSizeSmall">
          Email:
        </p>

        <MDBContainer className="form-group">
          <input type="email" placeholder="sisman@rpi.edu" className="form-control width-320px textBox"/>
        </MDBContainer>
        <p className="bold fontSizeSmall">
          Password:
        </p>
        <MDBContainer className="form-group">
          <input type="password" placeholder="••••••••••••••" className="form-control width-320px textBox"/>
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
    )
  }
}