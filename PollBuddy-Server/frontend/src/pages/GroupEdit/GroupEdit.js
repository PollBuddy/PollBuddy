import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import ErrorText from "../../components/ErrorText/ErrorText";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class GroupEdit extends Component {//this class will likely need to call Groups/new and do more with that...
  constructor(props) {
    super(props);
    this.state = {
      id: props.router.params.groupID,
      admins: [],
      users: [],
      loadingAdmins: true,
      loadingUsers: true,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Edit");
    this.loadAdmins();
    this.loadUsers();
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

  loadUsers = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/members`)
      .then((response => response.json()))
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            users: response.data,
            loadingUsers: false,
          });
        }
      });
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
              <React.Fragment>
                {this.state.admins.length === 0 ?
                  <p>Sorry, there are no admins in this group.</p> :
                  <React.Fragment>
                    {this.state.admins.map((admin) => (
                      <button style={{width: "12em"}} className="button">{admin.userName}</button>
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
              <LoadingWheel/> :
              <React.Fragment>
                {this.state.users.length === 0 ?
                  <p>Sorry, there are no members in this group.</p> :
                  <React.Fragment>
                    {this.state.users.map((user) => (
                      <button style={{width: "12em"}} className="button">{user.userName}</button>
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

export default withRouter(GroupEdit);
