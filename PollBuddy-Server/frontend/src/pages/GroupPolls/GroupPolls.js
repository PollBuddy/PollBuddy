import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./GroupPolls.scss";
import {MDBContainer, MDBIcon} from "mdbreact";
import GroupEditor from "../../components/GroupEditor/GroupEditor";

export default class GroupPolls extends Component {
  constructor(props) {//shouldn't this be dependent on the class???? thats why i included a constructor.
    super(props);
    //need to connect to backend probably here and then store data until it can be stored in state.
    //problem is there is no find in backend rn... frontend could do find but probably more resource intensive?
    this.state = {
      isMember: false,
      class: "1200 - Data Structures"
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
      <MDBContainer className="page GroupPolls">
        <MDBContainer className="Homepage-boxes two-box">
          {this.state.isMember ? (
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                {/*  TODO: change this to whatever was clicked on in the last screen*/}
                Member Settings:
              </p>
              <p className="fontSizeSmall">
                Total number of polls: 12
              </p>
              <p className="fontSizeSmall">
                Total nestions: 24
              </p>
              <p className="fontSizeSmall">
                Questions answered correctly: 21
              </p>

              {/*TODO: add more (correct) read-only information here*/}

              <Link to={"/Groups"}>
                <button className="btn button">Leave Group</button>
              </Link>
            </MDBContainer>
          ) : (
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                {/*  TODO: change this to whatever was clicked on in the last screen*/}
                Admin Settings
              </p>
              <Link to={"/polls/123/edit"}>
                <button className="btn button">Create New Poll</button>
              </Link>
              <p className="fontSizeSmall">
                Total number of polls: 12
              </p>
              <p className="fontSizeSmall">
                Total number of questions: 24
              </p>
              <p className="fontSizeSmall">
                Average correct answers: 21
              </p>
              {/*change name, details, add people, remove people*/}
              {/*TODO: admin should be able to select individual students and see their information here*/}

              <MDBContainer>
                <input type="GroupName" placeholder="New Group Name" className="display_none form-control textBox" id="groupText" />
                <button id="groupBtn" className="btn button" onClick={() => this.toggleTextBox("groupText","#groupBtn","Change Group Name")}>Change Group Name</button>
              </MDBContainer>

              <MDBContainer>
                <input type="AddStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="addText" />
                <button id="addBtn" className="btn button" onClick={() => this.toggleTextBox("addText","#addBtn","Add Student")}>Add Student</button>
              </MDBContainer>

              <MDBContainer>
                <input type="RemoveStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="removeText" />
                <button id="removeBtn" className="btn button" onClick={() => this.toggleTextBox("removeText","#removeBtn","Remove Student")}>Remove Student</button>
              </MDBContainer>

              <Link to={"/Groups"}>
                <button className="btn button">Delete this Group</button>
              </Link>
            </MDBContainer>
          )
          }
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              Polls
            </p>

            {/*TODO: arrows should represent active polls rather than mouse hover */}
            <ul>
              <li id="poll0">
                <a href={"/polls/:pollID/view"}>
                  <MDBIcon className="GroupPolls-arrow" icon="long-arrow-alt-right" size="lg"/>
                  <span>Lesson #1 - vectors</span>
                </a>
              </li>
              <li id="poll1">
                <a href={"/polls/:pollID/view"}>
                  <MDBIcon className="GroupPolls-arrow" icon="long-arrow-alt-right" size="lg"/>
                  <span>Lesson #2 - linked lists</span>
                </a>
              </li>
              <li id="poll2">
                <a href={"/polls/:pollID/view"}>
                  <MDBIcon className="GroupPolls-arrow" icon="long-arrow-alt-right" size="lg"/>
                  <span>Lesson #3 - sets</span>
                </a>
              </li>
              <li id="poll3">
                <a href={"/polls/:pollID/view"}>
                  <MDBIcon className="GroupPolls-arrow" icon="long-arrow-alt-right" size="lg"/>
                  <span>Lesson #4 - unordered maps</span>
                </a>
              </li>
            </ul>

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
