import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";
import "./GroupSettings.scss";
import {withRouter} from "../PropsWrapper/PropsWrapper";

class GroupSettings extends Component{
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
    this.props.router.navigate("/polls/new?groupID=" + this.state.id);
  };

  handleLeaveConfirm = () => {
    this.setState({showConfirm: true});
  };

  async handleLeaveGroup(leaveGroup) {
    if (leaveGroup) {
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/leave", {
        method: "POST",
      });

      if (response.status == 200) {
        this.props.router.navigate("/groups");
        return
      }
    }
    this.setState({showConfirm: false});
  };

  async handleDeleteGroup(deleteGroup) {
    if (deleteGroup) {
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/delete", {
        method: "POST",
      });

      if (response.status == 200) {
        this.props.router.navigate("/groups");
        return
      }
    }
    this.setState({showConfirm: false});
  };

  render(){
    if (this.state.isMember) {
      return (
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Member Settings
          </p>
          <button onClick={this.handleLeaveGroup} className="button">Leave Group</button>
          <MDBContainer fluid>
            { this.state.showConfirm
              ?
              <MDBContainer className="form-group">
                <p>Are you sure you want to leave this group?</p>
                <input onClick={this.handleLeaveGroup.bind(this, false)} className="button float-left" type="submit" value="No"/>
                <input onClick={this.handleLeaveGroup.bind(this, true)} className="button float-right" type="submit" value="Yes"/>
              </MDBContainer>
              :
              <button style={{width:"17em"}}
                className="button"
                onClick={this.handleLeaveConfirm}
                >Leave Group
                </button>
            }
          </MDBContainer>
        </MDBContainer>
      );
    } else if (this.state.isAdmin) {
      return (
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Admin Settings
          </p>
          <button style={{width: "17em"}}
            className="button"
            onClick={this.createNewPoll}
          >Create New Poll
          </button>
          <Link to={"/groups/"+ this.state.id +"/edit"}>
            <button style={{width: "17em"}}
              className="button"
            >Edit Group
            </button>
          </Link>
          
          <MDBContainer fluid>
            { this.state.showConfirm
              ?
              <MDBContainer className="form-group">
                <p>Are you sure you want to delete this group?</p>
                <input onClick={this.handleDeleteGroup.bind(this, false)} className="button float-left" type="submit" value="No"/>
                <input onClick={this.handleDeleteGroup.bind(this, true)} className="button float-right" type="submit" value="Yes"/>
              </MDBContainer>
              :
              <button style={{width:"17em"}}
                className="button"
                onClick={this.handleLeaveConfirm}
                >Delete this Group
                </button>
            }
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
export default withRouter(GroupSettings);