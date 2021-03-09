import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

export default class Settings extends Component{
  constructor(props) {
    super(props);
    //TODO: get all this as input from GroupPolls
    this.state = {
      isMember: false,
      class: "1200 - Data Structures",
      polls: [
        {pollId: 1, label: "Big O Notation"},
        {pollId: 2, label: "Basic C++ Syntax"},
        {pollId: 3, label: "Pointers"},
        {pollId: 4, label: "Vectors"},
        {pollId: 5, label: "Linked Lists"},
        {pollId: 6, label: "Sets"},
        {pollId: 7, label: "Maps"}
      ],
      total_questions: 24,
      avg_correct: 20,
      member_correct: 22
    };
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

          {/*TODO: add more (correct) read-only information here*/}

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

        <MDBContainer>
          <input type="GroupName" placeholder="New Group Name" className="display_none form-control textBox" id="groupText" />
          <button id="groupBtn" className="button" onClick={() => this.toggleTextBox("groupText","#groupBtn","Change Group Name")}>Change Group Name</button>
        </MDBContainer>

        <MDBContainer>
          <input type="AddStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="addText" />
          <button id="addBtn" className="button" onClick={() => this.toggleTextBox("addText","#addBtn","Add Student")}>Add Student</button>
        </MDBContainer>

        <MDBContainer>
          <input type="RemoveStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="removeText" />
          <button id="removeBtn" className="button" onClick={() => this.toggleTextBox("removeText","#removeBtn","Remove Student")}>Remove Student</button>
        </MDBContainer>

        <Link to={"/Groups"}>
          <button className="button">Delete this Group</button>
        </Link>
      </MDBContainer>
    )
    );
  }
}