import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./GroupPolls.scss";
import {MDBContainer} from "mdbreact";

export default class GroupPolls extends Component {
  constructor(props) {//shouldn't this be dependent on the class???? thats why i included a constructor.
    super(props);
    //need to connect to backend probably here and then store data until it can be stored in state.
    //problem is there is no find in backend rn... frontend could do find but probably more resource intensive?
    //TODO: get all this from a backend call
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
      //need to put in groupID from backend
      //need to get other shit like pollIDs and their respective information...
    };
  }

  componentDidMount() {
    this.props.updateTitle(this.state.class);
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
  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="two-box">
          {/*TODO: put the GroupEditor component here*/}
          {this.state.isMember ? (
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
                {/*  TODO: change this to whatever was clicked on in the last screen*/}
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
          }
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              My Polls
            </p>

            {this.state.polls.length === 0 ? (
              <p>Sorry, you don't have any polls.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.polls.map((e) => (
                  <Link to={"/polls/" + e.pollId + "/view"}>
                    <button style={{  width: "17em" }} className="button">{"Poll " + e.pollId + ": " + e.label}</button>
                  </Link>
                ))}
              </React.Fragment>
            )}

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
