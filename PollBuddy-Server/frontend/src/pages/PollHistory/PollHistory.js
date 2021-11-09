import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";

//TODO This page can only be access when one is logged in
//TODO Need to dynamically grab what polls the user has access to from the backend
//TODO Need a way to know which polls the users has admin access to and which they do not

export default class Groups extends Component {

  componentDidMount() {
    this.props.updateTitle("My Poll Histories");
  }

  //TODO, this state needs to be dynamically updated according to each user
  state = {
    pollsAdmin: [
      {id:"1", title:"CSCI 1200 - Data Structures"},
      {id:"2", title:"CSCI 2200 - Foundations of Computer Science"}
    ],
    pollsMember: [
      {id:"3", title:"CSCI 2300 - Intro to Algorithms"},
      {id:"4", title:"CSCI 2500 - Computer Organization"},
      {id:"5", title:"CSCI 2960 - RCOS"}
    ]
  }

  render() {
    //These if else statement chooses what to display depending on if you are in groups or not
    let adminDisplay;
    let memberDisplay;
    {
      if (this.state.pollsAdmin.length == 0) {
        adminDisplay = <p className="">Looks like you have not created any groups!</p>;
      } else {
        adminDisplay = <React.Fragment>
          {this.state.pollsAdmin.map(pollsAdmin => (
            <div key={pollsAdmin.id} className={pollsAdmin.title}>
              <Link to={"/polls/" + pollsAdmin.id + "/results"}>
                <button style={{  width: "20em" }} className="button">{pollsAdmin.title}</button>
              </Link>
            </div>
          ))}
        </React.Fragment>;
      }
      if (this.state.pollsMember.length == 0) {
        memberDisplay = <p className="">Looks like you are not in any groups!</p>;
      } else {
        memberDisplay = <React.Fragment>
          {this.state.pollsMember.map(pollsMember => (
            <div key={pollsMember.id} className={pollsMember.title}>
              <Link to={"/polls/" + pollsMember.id + "/results"}>
                <button style={{  width: "20em" }} className="button">{pollsMember.title}</button>
              </Link>
            </div>
          ))}
        </React.Fragment>;
      }
    }
    return (

      <MDBContainer className="page">
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            As a Group Admin:
          </p>
          {adminDisplay}
          <p className="fontSizeLarge">
            As a Group Member:
          </p>
          {memberDisplay}
        </MDBContainer>
      </MDBContainer>
    );
  }
}
