import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import Popup from "../../components/Popup/Popup";

export default class Groups extends Component {
  constructor() {
    super();
    this.state = {
      //TODO: fetch this data from api/users/:id/groups when that functionality works
      error: null,
      doneLoading: false,
      admin_groups: [
        // {id: 123, label: "CSCI 1200 - Data Structures"},
        // {id: 123, label: "CSCI 2200 - Foundations of Computer Science"}
      ],
      member_groups: [
        {id: 123, label: "CSCI 2300 - Intro to Algorithms"},
        {id: 123, label: "CSCI 2500 - Computer Organization"},
        {id: 123, label: "CSCI 2960 - RCOS"}
      ],
      openJoinGroupPopup: false
    };

    if(!localStorage.getItem("loggedIn")){
      //Redirect("/login");//this is a way to redirect the user to the page
      //window.location.reload(false);//this forces a reload so this will make the user go to the login page. A little barbaric but it works. If frontend wants to make it better by all means
    }
  }

  stopLoading = e => {
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
  handleClick = (event) => {

    // call prompt() with custom message to get user input from alert-like dialog 
    const groupCode = prompt('Please enter your group code');
    // combine the group code into URL and redirect to the next page
    window.location.replace("/groups/" + groupCode + "/polls");
  }

  render() {
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
        <MDBContainer>
          <LoadingWheel/>
          <button className="btn button" onClick={this.stopLoading}>End Loading</button>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              As a Group Admin:
            </p>
            {this.state.admin_groups.length === 0 ? (
              <p>Sorry, you are not the admin of any groups.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.admin_groups.map((e) => (
                  <Link to={"/groups/" + e.id + "/polls"}>
                    <button className="btn button width-20em">{e.label}</button>
                  </Link>
                ))}
              </React.Fragment>
            )}

            <p className="fontSizeLarge">
              As a Group Member:
            </p>
            {this.state.member_groups.length === 0 ? (
              <p>Sorry, you are not the member of any groups.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.member_groups.map((e) => (
                  <Link to={"/groups/" + e.id + "/polls"}>
                    <button className="btn button width-20em">{e.label}</button>
                  </Link>
                ))}
              </React.Fragment>
            )}

            <p className="fontSizeLarge">
              Group Management:
            </p>
            <Link to={"/groups/new"}>
              <button className="btn button">New Group</button>
            </Link>
            <button className="btn button" onClick={(e) => this.setState({ openJoinGroupPopup: true })}>Join Group</button>
            <Popup isOpen={this.state.openJoinGroupPopup} onClose={(e) => this.setState({ openJoinGroupPopup: false })}>
              Hello
            </Popup>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
