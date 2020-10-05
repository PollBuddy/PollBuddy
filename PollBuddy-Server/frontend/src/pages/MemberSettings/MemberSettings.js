import React, {Component} from "react";
import { Link } from "react-router-dom";
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
    this.props.updateTitle("Member Settings");
  }
  render() { 
    return (
        
      <MDBContainer className="page">
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            As a Group Admin:
          </p>
          <Link to={"/groups/123/edit"}>
            <button className="btn button">CSCI 1200 - Data Structures</button>
          </Link>
          <Link to={"/groups/123/edit"}>
            <button className="btn button">CSCI 2200 - Foundations of Computer Science</button>
          </Link>

          <p className="fontSizeLarge">
            As a Group Member:
          </p>
          <Link to={"/groups/123/polls"}>
            <button className="btn button">CSCI 2300 - Intro to Algorithms</button>
          </Link>
          <Link to={"/groups/123/polls"}>
            <button className="btn button">CSCI 2500 - Computer Organization</button>
          </Link>
          <Link to={"/groups/123/polls"}>
            <button className="btn button">CSCI 2960 - RCOS</button>
          </Link>

          <p className="fontSizeLarge">
            Group Management:
          </p>
          <Link to={"/groups/new"}>
            <button className="btn button">New Group</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
