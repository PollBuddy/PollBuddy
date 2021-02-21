import React, {Component} from "react";
import {Link} from "react-router-dom";
import { MDBContainer } from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import Popup from "../../components/Popup/Popup";

export default class Groups extends Component {

  constructor(){
    super();
    this.state = {
      //TODO: fetch this data from api/users/:id/groups when that functionality works
      error: null,
      doneLoading: false,
      adminGroups: [
        {groupId: 123, label: "CSCI 1200 - Data Structures"},
        {groupId: 123, label: "CSCI 2200 - Foundations of Computer Science"}
      ],
      memberGroups: [
        {groupId: 123, label: "CSCI 2300 - Intro to Algorithms"},
        {groupId: 123, label: "CSCI 2500 - Computer Organization"},
        {groupId: 123, label: "CSCI 2960 - RCOS"}
      ],
      openJoinGroupPopup: false,
      groupCode: "",
      leaveGroupButtonText: "Leave Group",
      showXs: false,
      isOpen: false
    };

    if(!localStorage.getItem("loggedIn")){
      //Redirect("/login");//this is a way to redirect the user to the page
      //window.location.reload(false);//this forces a reload so this will make the user go to the login page. A little barbaric but it works. If frontend wants to make it better by all means
    }
  }

  stopLoading = () => {
    this.setState({
      doneLoading: true
    });
  };

  signout(){
    //localStorage.removeItem("loggedIn");//todo if admin -- more specifically make diff states if the user who logged in is an admin... or teacher. wouldn't want teacher accessing user things or vice versa...
    //Redirect("/login");
  }
  componentDidMount() {
    this.props.updateTitle("My Groups");
  }
  toggleLeaveGroup = () => {
    this.setState(prevState => ({ showXs: !prevState.showXs }));
    if (this.state.leaveGroupButtonText === "Leave Group") {
      this.setState({ leaveGroupButtonText: "Exit Leave Group" });
    } else {
      this.setState({ leaveGroupButtonText: "Leave Group" });
    }
  };

  handleClick = () => {
    // call prompt() with custom message to get user input from alert-like dialog
    const groupCode = prompt("Please enter your group code");
    // combine the group code into URL and redirect to the next page
    window.location.replace("/groups/" + groupCode + "/polls");
  }
  handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "/groups/" + this.state.groupCode + "/polls";
  }
  handleChange = (e) => {
    this.setState({groupCode: e.target.value});
  }

  render() {
    const { showXs } = this.state;
    if(this.state.error != null){
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Error! Please try again.
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else if(!this.state.doneLoading){
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
          <button className="button" onClick={this.stopLoading}>End Loading</button>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              As a Group Admin:
            </p>
            {this.state.adminGroups.length === 0 ? (
              <p>Sorry, you are not the admin of any groups.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.adminGroups.map((e) => (
                  <Link to={"/groups/" + e.groupId + "/polls"}>
                    <button style={{  width: "20em" }} className="button">{e.label}</button>
                  </Link>
                ))}
              </React.Fragment>
            )}

            <p className="fontSizeLarge">
              As a Group Member:
            </p>
            {this.state.memberGroups.length === 0 ? (
              <p>Sorry, you are not the member of any groups.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.memberGroups.map((e) => (
                  <div>
                    <Link to={"/groups/" + e.groupId + "/polls"}>
                      <button style={{  width: "20em" }} className="button">{e.label}</button>
                    </Link>
                    {showXs && <LeaveGroupIcon openDialog={() => this.setState({ isOpen: true })} />}
                  </div>
                ))}
              </React.Fragment>
            )}

            <p className="fontSizeLarge">
              Group Management:
            </p>
            <Link to={"/groups/new"}>
              <button className="button">Create New Group</button>
            </Link>
            <button className="btn button" onClick={() => this.setState({ openJoinGroupPopup: true })}>Join Existing Group</button>
            <Popup isOpen={this.state.openJoinGroupPopup} onClose={() => this.setState({ openJoinGroupPopup: false })}>
              <form onSubmit={this.handleSubmit}>
                <label>Please enter your group code:</label>
                <input className="form-control textBox" type="text" name="groupCode" onChange={this.handleChange}/>
                <input className="btn button float-right" type="submit" value="OK"/>
              </form>
            </Popup>
            <button className="button" onClick={this.toggleLeaveGroup}>{this.state.leaveGroupButtonText}</button>
            {this.state.isOpen && <Dialog onClose={() => this.setState({isOpen: false})} />}
          </MDBContainer>
        </MDBContainer>
      );
    }
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
      <button onClick={props.onClose} className="button">X</button>
      <p>Are you sure you want to leave this group?</p>
      <button onClick={props.onClose} className="button leave_group_button">Yes</button>
    </div>
  );
}
