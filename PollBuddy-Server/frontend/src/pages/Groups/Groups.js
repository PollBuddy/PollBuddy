import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import { MDBContainer } from "mdbreact";

function getGroups(){
  return [
    {key: 0, id: 123, label: "CSCI 2300 - Intro to Algorithms"},
    {key: 1, id: 123, label: "CSCI 2500 - Computer Organization"},
    {key: 2, id: 123, label: "CSCI 2960 - RCOS"}
  ]
}

export default class Groups extends Component {
  constructor(){
    super();
    this.state = {
      admin_groups: [
        {key: 0, id: 123, label: "CSCI 1200 - Data Structures"},
        {key: 1, id: 123, label: "CSCI 2200 - Foundations of Computer Science"}
      ],
      member_groups: [
        {key: 0, id: 123, label: "CSCI 2300 - Intro to Algorithms"},
        {key: 1, id: 123, label: "CSCI 2500 - Computer Organization"},
        {key: 2, id: 123, label: "CSCI 2960 - RCOS"}
      ],
      all_groups: getGroups()
    };

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
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            As a Group Admin:
          </p>
          {this.state.admin_groups.map((e) => (
              <Link to={"/groups/" + e.id + "/polls"}>
                <button className="btn button width-20em">{e.label}</button>
              </Link>
          ))}

          <p className="fontSizeLarge">
            As a Group Member:
          </p>
          {this.state.member_groups.map((e) => (
              <Link to={"/groups/" + e.id + "/polls"}>
                <button className="btn button width-20em">{e.label}</button>
              </Link>
          ))}

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
