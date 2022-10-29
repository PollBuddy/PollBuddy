import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.router.params.groupID,
      name: "",
      description: "",
      isMember: false,
      isAdmin: false,
      polls: [],
      doneLoading: false,
      showError: null,
      nameInput: "",
      descriptionInput: "",
    };
  }

  async componentDidMount() {
    this.props.updateTitle(this.state.name);
    this.getGroupData();
    this.getGroupPolls();
  }

  async getGroupData() {
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id, {
      method: "GET"
    });
    let response = await httpResponse.json();
    if (response.result === "success") {
      this.props.updateTitle(response.data.name);
      if (response.data.isMember || response.data.isAdmin) {
        this.setState({
          name: response.data.name,
          description: response.data.description,
          isMember: response.data.isMember,
          isAdmin: response.data.isAdmin,
          doneLoading: true
        });
      } else {
        this.setState({
          showError: true,
        });
      }
    } else {
      this.setState({
        showError: true,
      });
    }
  }

  async getGroupPolls() {
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/polls", {
      method: "GET"
    });
    let response = await httpResponse.json();
    if (response.result === "success") {
      this.setState({
        polls: response.data,
      });
    }
  }

  createNewPoll = async () => {
    this.props.router.navigate("/polls/new?groupID=" + this.state.id);
  };

  handleLeaveGroup = async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/leave", {
      method: "POST",
    });
    this.props.router.navigate("/groups");
  };

  handleDeleteGroup = async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/delete", {
      method: "POST",
    });
    this.props.router.navigate("/groups");
  };

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    this.setState({doneLoading: false});
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/edit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.nameInput,
        description: this.state.descriptionInput,
      })
    });
    let response = await httpResponse.json();
    if (response.result === "success") {
      this.setState({
        showError: false,
        name: this.state.nameInput,
        description: this.state.descriptionInput,
        doneLoading: true,
      });
    } else {
      this.setState({
        showError: true,
        doneLoading: true,
      });
    }
  };

  render() {
    if (this.state.showError) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Error loading data! Please try again.
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else if (!this.state.doneLoading) {
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else if (!this.state.isMember && !this.state.isAdmin) {
      //TODO: Display join button to the user if they are not in group
      return (
        <MDBContainer className="page">
          <p className="fontSizeLarge">
            {this.state.name}
          </p>
          <button className="button">
            Join
          </button>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="two-box">
            {this.state.isMember &&
              <MDBContainer className="box">
                <p className="fontSizeLarge">
                  Group Name
                </p>
                <p className="fontSizeMedium">
                  {this.state.name}
                </p>
                <p className="fontSizeLarge">
                  Group Description
                </p>
                <p className="fontSizeMedium">
                  {this.state.description}
                </p>
                <button onClick={this.handleLeaveGroup} className="button">Leave Group</button>
              </MDBContainer>
            }
            {this.state.isAdmin &&
              <MDBContainer className="box">
                <MDBContainer className="form-group">
                  <p className="fontSizeLarge">
                    Group Name
                  </p>
                  <input
                    name="nameInput"
                    id="groupName"
                    className="form-control textBox"
                    value={this.state.nameInput}
                    onInput={this.onInput}
                  />
                  <p className="fontSizeLarge">
                    Group Description
                  </p>
                  <input
                    name="descriptionInput"
                    id="groupDescription"
                    className="form-control textBox"
                    value={this.state.descriptionInput}
                    onInput={this.onInput}
                  />
                </MDBContainer>
                <button style={{width: "17em"}}
                  className="button" onClick={this.onSubmit}>
                  Save Changes
                </button>
                <button style={{width: "17em"}}
                  className="button"
                  onClick={this.createNewPoll}
                >Create New Poll
                </button>
                <Link to={"/groups/" + this.state.id + "/edit"}>
                  <button style={{width: "17em"}}
                    className="button"
                  >Edit Group
                  </button>
                </Link>
                <button style={{width: "17em"}}
                  className="button"
                  onClick={this.handleDeleteGroup}
                >Delete this Group
                </button>
              </MDBContainer>
            }
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                My Polls
              </p>
              {this.state.polls.length === 0 ? (
                <p>You don't have any polls available at this time.<br/> <br/></p>
              ) : (
                <React.Fragment>
                  {this.state.polls.map((poll, index) => (
                    <Link to={"/polls/" + poll.id + (this.state.isAdmin ? "/edit" : "/view")} style={{width: "17em"}}>
                      <button style={{width: "20em"}}
                        className="button">{"Poll " + (index + 1) + ": " + poll.title}</button>
                    </Link>
                  ))}
                </React.Fragment>
              )}
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}

export default withRouter(Group);
