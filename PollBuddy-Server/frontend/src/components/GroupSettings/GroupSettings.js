import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";
import "./GroupSettings.scss";
import LoadingWheel from "../LoadingWheel/LoadingWheel";

export default class GroupSettings extends Component{
  constructor(props) {
    super(props);
    this.state = this.props.state;
  }

  toggleTextBox(elementId, selector, text) {
    if(document.getElementById(elementId).style.display === "block") {
      document.getElementById(elementId).style.display = "none";
      document.querySelector(selector).textContent = text;
    } else {
      document.getElementById(elementId).style.display = "block";
      document.querySelector(selector).textContent = "Submit";
    }
  }

  createNewPoll = async () => {
    window.location.href = "/polls/new?groupID=" + this.state.id;
  };

  handleLeaveGroup = async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/leave", {
      method: "POST",
    });
    window.location.replace("/groups");
  };

  handleDeleteGroup = async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/delete", {
      method: "POST",
    });
    window.location.replace("/groups");
  };

  render(){
    if (this.state.isMember) {
      return (
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Member Settings:
          </p>
          <button onClick={this.handleLeaveGroup} className="button">Leave Group</button>
        </MDBContainer>
      );
    } else if (this.state.isAdmin) {
      return (
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Admin Settings
          </p>
          <button style={{width: "17em"}} className="button" onClick={this.createNewPoll}>Create New Poll</button>
          <Link to={"/groups/"+ this.state.id +"/edit"}>
            <button style={{width: "17em"}} className="button">Edit Group</button>
          </Link>
          <button style={{width: "17em"}} className="button" onClick={this.handleDeleteGroup} >Delete this Group</button>
        </MDBContainer>
      );
    }
  }
}
