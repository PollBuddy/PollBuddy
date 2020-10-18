import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import { MDBContainer } from "mdbreact";

//TODO This page can only be access when one is logged in
//TODO Need to dynamically grab what polls the user has access to from the backend
//TODO Need a way to know which polls the users has admin access to and which they do not

// /api/users/
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
    this.props.updateTitle("My Poll Histories");
  }
  //TODO, this state needs to be dynamically updated according to each user
  state = {
    polls_admin : [
      {id: "1", title: "CSCI 1200 - Data Structures"},
      {id: "2", title: "CSCI 2200 - Foundations of Computer Science"}
    ],
    polls_member : [
      {id: "3", title: "CSCI 2300 - Intro to Algorithms"},
      {id: "4", title: "CSCI 2500 - Computer Organization"},
      {id: "5", title: "CSCI 2960 - RCOS"}
    ]
  }
  render() {
    return (

      <MDBContainer className="page">
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            As a Group Admin:
          </p>
          {//Uses react to loop through polls_admin and make buttons. same step for polls_members
            <React.Fragment>
              {this.state.polls_admin.map(polls_admin => (
                  <li key={polls_admin.id} className={polls_admin.title}>
                    <Link to={"/polls/" + polls_admin.id + "/results"}>
                      <button className="btn button">{polls_admin.title}</button>
                    </Link>
                  </li>
              ))}
            </React.Fragment>
          }
          <p className="fontSizeLarge">
            As a Group Member:
          </p>

          <React.Fragment>
              {this.state.polls_member.map(polls_member => (
                  <li key={polls_member.id} className={polls_member.title}>
                    <Link to={"/polls/"+polls_member.id+"/results"}>
                      <button className = "btn button">{polls_member.title}</button>
                    </Link>
                  </li>
              ))}
          </React.Fragment>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
