import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import ErrorText from "../../components/ErrorText/ErrorText";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class GroupEdit extends Component {//this class will likely need to call Groups/new and do more with that...
  constructor(props) {
    super(props);
    this.state = {
      id: props.router.params.groupID,
      name: "",
      nameInput: "",
      description: "",
      descriptionInput: "",
      admins: [],
      members: [],
      loadingGroupData: true,
      loadingAdmins: true,
      loadingMembers: true,
      showError: false,
    };
  }

  componentDidMount(){
    this.props.updateTitle("Edit");
    this.loadGroup();
    this.loadAdmins();
    this.loadMembers();
  }

  loadGroup = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}`)
      .then((response => response.json()))
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            name: response.data.name,
            nameInput: response.data.name,
            description: response.data.description,
            descriptionInput: response.data.description,
            loadingGroupData: false,
          });
        } else {
          this.props.router.navigate("/groups");
        }
      });
  };

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

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  getGroupData = () => {
    return {
      name: this.state.nameInput,
      description: this.state.descriptionInput,
    };
  };

  onSubmit = () => {
    this.setState({ loadingGroupData: true });
    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      body: JSON.stringify(this.getGroupData())
    }).then((response) => response.json())
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            showError: false,
            name: this.state.nameInput,
            description: this.state.descriptionInput,
            loadingGroupData: false,
          });
        } else {
          this.setState({
            showError: true,
            loadingGroupData: false,
          });
        }
      });
  };

  checkError = () => {
    return this.state.showError ? <ErrorText/> : null;
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
    if (this.state.loadingGroupData === true) {
      return (
        <MDBContainer fluid className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer className="two-box">
            <MDBContainer className="box">
              <MDBContainer className="form-group">
                <p className="fontSizeLarge">
                  {this.state.name}
                </p>
                <p className="fontSizeMedium">
                  Group Name:
                </p>
                <input
                  name="nameInput"
                  id="groupName"
                  className="form-control textBox"
                  value={this.state.nameInput}
                  onInput={this.onInput}
                />
                <p className="fontSizeMedium">
                  Group Description:
                </p>
                <input
                  name="descriptionInput"
                  id="groupDescription"
                  className="form-control textBox"
                  value={this.state.descriptionInput}
                  onInput={this.onInput}
                />
              </MDBContainer>
              {this.checkError()}
              <button className="button" onClick={this.onSubmit}>
                Save Changes
              </button>
            </MDBContainer>
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                Admins
              </p>
              {this.state.loadingAdmins ?
                <LoadingWheel /> :
                <React.Fragment>
                  {this.state.admins.length === 0 ?
                    <p>Sorry, there are no admins in this group.</p> :
                    <MDBContainer>
                      <React.Fragment>
                        {this.state.admins.map((admin) => (
                          <React.Fragment>
                            <button style={{  width: "7em" }} className="button">{admin.userName}</button>
                            <button
                              type="submit" className="button"
                              onClick={() => { this.handleDemoteAdmin(admin); }}
                            >-</button>
                          </React.Fragment>
                        ))}
                      </React.Fragment>

                    </MDBContainer>
                  }
                </React.Fragment>
              }
            </MDBContainer>
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                Members
              </p>
              {this.state.loadingMembers ?
                <LoadingWheel /> :
                <React.Fragment>
                  {this.state.members.length === 0 ?
                    <p>Sorry, there are no members in this group.</p> :
                    <MDBContainer>
                      <React.Fragment>
                        {this.state.members.map((user) => (
                          <React.Fragment>
                            <button type="submit" className="button"
                              onClick={() => { this.handlePromoteMember(user); }}
                            >+</button>
                            <button style={{  width: "7em" }} className="button">{user.userName}</button>
                            <button
                              type="submit" className="button"
                              onClick={() => { this.handleDemoteMember(user); }}
                            >-</button>
                          </React.Fragment>
                          //<button type="submit" className="button">+</button>
                          //<button style={{  width: "7em" }} className="button">{user.userName}</button>
                          // <button type="submit" className="button">-</button>
                        ))}
                        {/*<button type="submit" className="button">-</button>*/}
                      </React.Fragment>
                    </MDBContainer>
                  }
                </React.Fragment>
              }
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}

export default withRouter(GroupEdit);
