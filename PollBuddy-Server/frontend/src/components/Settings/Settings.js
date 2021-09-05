import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

import "./Settings.scss";

export default class Settings extends Component{
  constructor(props) {
    super(props);
    this.state = this.props.state;
    if (!this.state.groupData) {
      this.state.groupData = {}; // This shouldn't happen, but if it does this line will prevent a crash.
    }
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
  render(){
    return (
      this.state.isMember ? (
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Member Settings:
          </p>
          <p className="fontSizeSmall">
            {"Total number of polls: " + this.state.polls.length}
          </p>
          <p className="fontSizeSmall">
            {"Total questions: " + this.state.total_questions}
          </p>
          <p className="fontSizeSmall">
            {"Questions answered correctly: " + this.state.member_correct}
          </p>

          <Link to={"/Groups"}>
            <button className="button">Leave Group</button>
          </Link>
        </MDBContainer>
      ) : (
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Admin Settings
          </p>
          <Link to={"/polls/123/edit"}>
            <button className="button">Create New Poll</button>
          </Link>
          <p className="fontSizeSmall">
            {"Total number of polls: " + this.state.polls.length}
          </p>
          <p className="fontSizeSmall">
            {"Total questions: " + this.state.total_questions}
          </p>
          <p className="fontSizeSmall">
            {"Average correct answers: " + this.state.avg_correct}
          </p>
          {/*change name, details, add people, remove people*/}
          {/*TODO: admin should be able to select individual students and see their information here*/}
          <MDBContainer className="groupEditBox">
            <input type="GroupName" placeholder="New Group Name" className="display_none form-control textBox" id="groupText" />
            <button id="groupBtn" className="button" onClick={() => this.toggleTextBox("groupText","#groupBtn","Change Group Name")}>Change Group Name</button>
          </MDBContainer>

          <MDBContainer className="groupEditBox">
            <input type="AddStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="addText" />
            <button id="addBtn" className="button" onClick={() => this.toggleTextBox("addText","#addBtn","Add Student")}>Add Student</button>
          </MDBContainer>

          <MDBContainer className="groupEditBox">
            <input type="RemoveStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="removeText" />
            <button id="removeBtn" className="button" onClick={() => this.toggleTextBox("removeText","#removeBtn","Remove Student")}>Remove Student</button>
          </MDBContainer>

          <Link to={"/Groups"}>
            <button className="button" onClick={() => fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.groupData._id + "/delete",{method:"POST"})}>Delete this Group</button>
          </Link>
        </MDBContainer>
      )
    );
  }
}