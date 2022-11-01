import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";
import "./UserPollsSettings.scss";
import {withRouter} from "../PropsWrapper/PropsWrapper";

class UserPollsSettings extends Component{
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
    this.props.router.navigate("/polls/new");
  };

//   handleLeaveGroup = async () => {
//     await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/leave", {
//       method: "POST",
//     });
//     this.props.router.navigate("/groups");
//   };

//   handleDeleteGroup = async () => {
//     await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/delete", {
//       method: "POST",
//     });
//     this.props.router.navigate("/groups");
//   };

  render(){
    return (
    <MDBContainer className="box">
        <p className="fontSizeLarge">
        Creator Settings
        </p>
        <button style={{width: "17em"}}
        className="button"
        onClick={this.createNewPoll}
        >Create New Poll
        </button>
    </MDBContainer>
    );
  }
}
export default withRouter(UserPollsSettings);