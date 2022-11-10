import React, {Component} from "react";
import {Link, Navigate} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import "../../styles/main.scss";
import "./Groups.scss";

class Groups extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      redirect: false,
      doneLoading: false,
      adminGroups: [],
      memberGroups: [],
    };
  }

  componentDidMount() {
    this.props.updateTitle("My Groups");
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/me/groups")
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          adminGroups: response.data.admin,
          memberGroups: response.data.member,
          doneLoading: true
        });
      });
  }

  toggleLeaveGroup = () => {
    this.setState(prevState => ({showXs: !prevState.showXs}));
    if (this.state.leaveGroupButtonText === "Leave Group") {
      this.setState({leaveGroupButtonText: "Exit Leave Group"});
    } else {
      this.setState({leaveGroupButtonText: "Leave Group"});
    }
  };

  render() {
    if (this.state.error != null) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Error! Please try again.
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
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="two-box">
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                Group Management
              </p>
              <Link to={"/groups/new"}>
                <button style={{width: "20em"}} className="button">Create New Group</button>
              </Link>
              <Link to={"/groups/join"}>
                <button style={{width: "20em"}} className="button">Join Group</button>
              </Link>
            </MDBContainer>
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                Groups
              </p>
              <p className="fontSizeLarge">
                As a Group Admin
              </p>
              {this.state.adminGroups.length === 0 ? (
                <p>You are not the admin of any groups.<br/> <br/></p>
              ) : (
                <React.Fragment>
                  {this.state.adminGroups.map((e) => (
                    <Link to={"/groups/" + e.id}>
                      <button style={{width: "20em"}} className="button">{e.name}</button>
                    </Link>
                  ))}
                </React.Fragment>
              )}
              <p className="fontSizeLarge">
                As a Group Member
              </p>
              {this.state.memberGroups.length === 0 ? (
                <p>You are not a member of any groups.<br/> <br/></p>
              ) : (
                <React.Fragment>
                  {this.state.memberGroups.map((e) => (
                    <div>
                      <Link to={"/groups/" + e.id}>
                        <button style={{width: "20em"}} className="button">{e.name}</button>
                      </Link>
                    </div>
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

export default withRouter(Groups);
