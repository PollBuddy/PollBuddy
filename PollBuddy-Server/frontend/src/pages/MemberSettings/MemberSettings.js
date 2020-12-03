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
            {/*  TODO: change this to whatever was clicked on in the last screen*/}
            CSCI 2300 - Intro to Algorithms
          </p>

          <p className="fontSizeSmall">
            Total number of polls: 12
          </p>
          <p className="fontSizeSmall">
            Total number of questions: 24
          </p>
          <p className="fontSizeSmall">
            Number of questions answered correctly: 21
          </p>

          {/*TODO: add more (correct) read-only information here*/}

          <Link to={"/Groups"}>
            <button className="button">Leave Group</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
