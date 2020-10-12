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

  toggleShowChangeGroupName() {
    if(document.getElementById("groupText").style.display === "block") {
      document.getElementById("groupText").style.display = "none";
      document.querySelector("#groupBtn").textContent = "Change group name";
    } else {
      document.getElementById("groupText").style.display = "block";
      document.querySelector("#groupBtn").textContent = "Submit";
    }
  }
  toggleAddStudent() {
    if(document.getElementById("addText").style.display === "block") {
      document.getElementById("addText").style.display = "none";
      document.querySelector("#addBtn").textContent = "Add Student";
    } else {
      document.getElementById("addText").style.display = "block";
      document.querySelector("#addBtn").textContent = "Submit";
    }
  }
  toggleRemoveStudent() {
    if(document.getElementById("removeText").style.display === "block") {
      document.getElementById("removeText").style.display = "none";
      document.querySelector("#removeBtn").textContent = "Remove Student";
    } else {
      document.getElementById("removeText").style.display = "block";
      document.querySelector("#removeBtn").textContent = "Submit";
    }
  }
  componentDidMount(){
    this.props.updateTitle("Admin Settings");
  }
  render() {
    return (

      <MDBContainer className="page">
        <MDBContainer className="box">

          <p className="fontSizeLarge">
            {/*  TODO: change this to whatever was clicked on in the last screen*/}
            CSCI 1200 - Data Structures
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
            <button id="groupBtn" className="btn button" onClick={this.toggleShowChangeGroupName}>Change Group Name</button>
          </MDBContainer>

          <MDBContainer>
            <input type="AddStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="addText" />
            <button id="addBtn" className="btn button" onClick={this.toggleAddStudent}>Add Student</button>
          </MDBContainer>

          <MDBContainer>
            <input type="RemoveStudent" placeholder="Input RCSID or RIN" className="display_none form-control textBox" id="removeText" />
            <button id="removeBtn" className="btn button" onClick={this.toggleRemoveStudent}>Remove Student</button>
          </MDBContainer>

          <Link to={"/Groups"}>
            <button className="btn button">Delete this Group</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
