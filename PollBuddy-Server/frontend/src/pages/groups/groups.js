import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import { MDBContainer } from "mdbreact";

export default class Groups extends Component {
  constructor(){
    super();
    if(!localStorage.getItem("loggedIn")){
      //Redirect("/login");//this is a way to redirect the user to the page
      //window.location.reload(false);//this forces a reload so this will make the user go to the login page. A little barbaric but it works. If frontend wants to make it better by all means
    }
  }
  signout(){
    //localStorage.removeItem("loggedIn");//todo if admin -- more specifically make diff states if the user who logged in is an admin... or teacher. wouldn't want teacher accessing user things or vice versa...
    //Redirect("/login");
  }
  componentDidMount(){
    this.props.updateTitle("My Groups");
  }
  render() { 
    return (

      <MDBContainer className="page">
        <p className="width-90 fontSizeLarge">
					As Instructor:
        </p>
        <Link to={"/groups/groupPolls"}>
          <button className="btn button">CSCI 1200 - Data Structures</button>
        </Link>
        <Link to={"/groups/groupPolls"}>
          <button className="btn button">CSCI 2200 - Foundations of Computer Science</button>
        </Link>

        <p className="width-90 fontSizeLarge">
					As Student:
        </p>
        <Link to={"/groups/groupPolls"}>
          <button className="btn button">CSCI 2300 - Intro to Algorithms</button>
        </Link>
        <Link to={"/groups/groupPolls"}>
          <button className="btn button">CSCI 2500 - Computer Organization</button>
        </Link>
        <Link to={"/groups/groupPolls"}>
          <button className="btn button">CSCI 2960 - RCOS</button>
        </Link>

        <p className="width-90 fontSizeLarge">
              Poll Management:
        </p>

        <Link to={"/groups/new"}>
          <button className="btn button">New Class</button>
        </Link>

        <Link to={"/polls/:pollID/results"}>
          <button className="btn button">Poll Data Viewer</button>
        </Link>

        <Link to={"/groups/pollView"}>
          <button className="btn button">Current Poll</button>
        </Link>

        <p className="width-90 fontSizeLarge">
              My Account Info:
        </p>

        <Link to={"/account"}>
          <button className="btn button">Account Details</button>
        </Link>

        <Link to={"/login/reset"}>
          <button className="btn button">Reset Password</button>
        </Link>

      </MDBContainer>
    );
  }
}
