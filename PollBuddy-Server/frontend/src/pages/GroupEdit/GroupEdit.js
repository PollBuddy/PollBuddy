import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import GroupEditor from "../../components/GroupEditor/GroupEditor";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {Link} from "react-router-dom";

export default class GroupEdit extends Component {//this class will likely need to call Groups/new and do more with that...
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.groupID,
      name: "",
      admins: [],
      users: [],
      loadingGroupData: true,
      loadingAdmins: true,
      loadingUsers: true,

      inputName: "",
      inputDescription: "",
    };
  }

  componentDidMount(){
    this.props.updateTitle("Edit");
    this.loadGroup();
    this.loadAdmins();
    this.loadUsers();
  }

  loadGroup = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}`)
      .then((response => response.json()))
      .then((response) => {
        this.setState({
          name: response.data.name,
          des
          loadingGroupData: false,
        });
      });
  };

  loadAdmins = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/admins`)
      .then((response => response.json()))
      .then((response) => {
        this.setState({
          admins: response.data,
          loadingAdmins: false,
        });
      });
  };

  loadUsers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/users`)
      .then((response => response.json()))
      .then((response) => {
        this.setState({
          users: response.data,
          loadingUsers: false,
        });
      });
  };

  onInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
                  name="inputName"
                  id="groupName"
                  className="form-control textBox"
                  value={this.state.inputName}
                  onInput={this.onInput}
                />
                <p className="fontSizeMedium">
                  Group Description:
                </p>
                <input
                  name="inputDescription"
                  id="groupDescription"
                  className="form-control textBox"
                  value={this.state.inputDescription}
                  onInput={this.onInput}
                />
              </MDBContainer>
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
                    <React.Fragment>
                      {this.state.admins.map((admin) => (
                        <button style={{  width: "12em" }} className="button">{admin.userName}</button>
                      ))}
                    </React.Fragment>
                  }
                </React.Fragment>
              }
            </MDBContainer>
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                Members
              </p>
              {this.state.loadingUsers ?
                <LoadingWheel /> :
                <React.Fragment>
                  {this.state.users.length === 0 ?
                    <p>Sorry, there are no members in this group.</p> :
                    <React.Fragment>
                      {this.state.users.map((user) => (
                        <button style={{  width: "12em" }} className="button">{user.userName}</button>
                      ))}
                    </React.Fragment>
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
