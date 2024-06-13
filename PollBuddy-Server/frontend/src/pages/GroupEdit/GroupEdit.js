import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class GroupEdit extends Component {//this class will likely need to call Groups/new and do more with that...
  constructor(props) {
    super(props);
    this.state = {
      id: props.router.params.groupID,
      admins: [],
      members: [],
      loadingAdmins: true,
      loadingMembers: true,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Edit");
    this.loadAdmins();
    this.loadMembers();
  }

  loadAdmins = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/admins`)
      .then((response => response.json()))
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            admins: response.data,
            loadingAdmins: false,
          });
        }
      });
  };

  loadMembers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/members`)
      .then((response => response.json()))
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            members: response.data,
            loadingMembers: false,
          });
        }
      });
  };

  handleDemoteAdmin = async (demoteId) => {
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/demote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: demoteId.id
      })
    });
    let response = await httpResponse.json();
    if(response.result === "success") {
      this.setState((prevState) => {
        const index = prevState.admins.indexOf(demoteId);
        prevState.admins.splice(index, 1);
        return {
          members: [...prevState.members, demoteId],
        };
      });
    } else {
      if(response.status === "Forbidden") {
        alert(response.error);
      }
    }
  };
  handleDemoteMember = async (demoteId) => {
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/demote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: demoteId.id
      })
    });
    let response = await httpResponse.json();
    if(response.result === "success") {
      this.setState((prevState) => {
        const index = prevState.members.indexOf(demoteId);
        prevState.members.splice(index, 1);
        return {members: [...prevState.members]};
      });
    }
  };
  handlePromoteMember = async (promoteId) => {
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID: promoteId.id
      })
    });
    let response = await httpResponse.json();
    if(response.result === "success") {
      this.setState((prevState) => {
        const index = prevState.members.indexOf(promoteId);
        prevState.members.splice(index, 1);
        return {
          admins: [...prevState.admins, promoteId],
        };
      });
    }
  };
  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer className="two-box">
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              Admins
            </p>
            {this.state.loadingAdmins ?
              <LoadingWheel/> :
              <MDBContainer>
                {this.state.admins.length === 0 ?
                  <p>Sorry, there are no admins in this group.</p> :
                  <React.Fragment>
                    {this.state.admins.map((admin) => (
                      <div>
                        <button style={{  width: "12em" }} className="button">{admin.userName}</button>
                        <button
                          type="submit" className="button"
                          onClick={() => { this.handleDemoteAdmin(admin); }}
                        >-</button>
                      </div>
                    ))}
                  </React.Fragment>
                }
              </MDBContainer>
            }
          </MDBContainer>
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              Members
            </p>
            {this.state.loadingMembers ?
              <LoadingWheel/> :
              <MDBContainer>
                {this.state.members.length === 0 ?
                  <p>Sorry, there are no members in this group.</p> :
                  <React.Fragment>
                    {this.state.members.map((user) => (
                      <div>
                        <button type="submit" className="button"
                          onClick={() => { this.handlePromoteMember(user); }}
                        >+</button>
                        <button style={{  width: "12em" }} className="button">{user.userName}</button>
                        <button
                          type="submit" className="button"
                          onClick={() => { this.handleDemoteMember(user); }}
                        >-</button>
                      </div>
                    ))}
                  </React.Fragment>
                }
              </MDBContainer>
            }
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(GroupEdit);
