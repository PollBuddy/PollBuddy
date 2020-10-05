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
            <input type="GroupName" placeholder="New Group Name" className="form-control textBox" id="idText" />
            <button className="btn button">Change Group Name</button>

            <input type="RCSID" placeholder="Input RCSID to add student" className="form-control textBox" id="idText" />
            <button className="btn button">Add Student</button>

            <input type="RCSID" placeholder="Input RCSID to remove student" className="form-control textBox" id="idText" />
            <button className="btn button">Remove Student</button>
          </MDBContainer>



          <Link to={"/Groups"}>
            <button className="btn button">Delete this Group</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
