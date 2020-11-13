import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import { MDBContainer } from "mdbreact";

export default class Groups extends Component {
  state = {
    showXs: false,
    isOpen: false,
    leaveGroupButtonText: "Leave Group"
  };
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
    this.props.updateTitle("My Groups");
  }
  toggleLeaveGroup = () => {
    this.setState(prevState => ({ showXs: !prevState.showXs }));
    if (this.state.leaveGroupButtonText == "Leave Group") {
      this.setState({ leaveGroupButtonText: "Exit Leave Group" });
    } else {
      this.setState({ leaveGroupButtonText: "Leave Group" });
    }
  };
  render() { 
    const { showXs } = this.state;
    return (

      <MDBContainer className="page">
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            As a Group Admin:
          </p>
          <Link to={"/groups/123/edit"}>
            <button className="btn button">CSCI 1200 - Data Structures</button>
          </Link>
          <Link to={"/groups/123/edit"}>
            <button className="btn button">CSCI 2200 - Foundations of Computer Science</button>
          </Link>

          <p className="fontSizeLarge">
            As a Group Member:
          </p>
          <div>
            <Link to={"/groups/123/polls"}>
              <button className="btn button">CSCI 2300 - Intro to Algorithms</button>  
            </Link>
            {showXs && <LeaveGroupIcon openDialog={(e) => this.setState({ isOpen: true })} />}
          </div>
          <div>
            <Link to={"/groups/123/polls"}>
              <button className="btn button">CSCI 2500 - Computer Organization</button>
            </Link>
            {showXs && <LeaveGroupIcon openDialog={(e) => this.setState({ isOpen: true })} />}
          </div>
          <div>
            <Link to={"/groups/123/polls"}>
              <button className="btn button">CSCI 2960 - RCOS</button>
            </Link>
            {showXs && <LeaveGroupIcon openDialog={(e) => this.setState({ isOpen: true })} />}
          </div>

          <p className="fontSizeLarge">
            Group Management:
          </p>
          <Link to={"/groups/new"}>
            <button className="btn button">New Group</button>
          </Link>
          <button className="btn button" onClick={this.toggleLeaveGroup}>{this.state.leaveGroupButtonText}</button>
        
          {this.state.isOpen && <Dialog onClose={(e) => this.setState({ isOpen: false})}></Dialog>}
        </MDBContainer>
      </MDBContainer>
    );
  }
}

function LeaveGroupIcon(props) {
  return (
    <span className="groups_removable" onClick={props.openDialog}>X</span>
  );
}

function Dialog(props) {
  return (
    <div className="leave_groups_dialog">
      <button onClick={props.onClose} className="btn button">X</button>
      <p>Are you sure you want to leave this group?</p>
      <button onClick={props.onClose} className="btn button leave_group_button">Yes</button>
    </div>
  );
}
