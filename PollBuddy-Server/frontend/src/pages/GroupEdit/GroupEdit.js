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

  loadGroup = async () => {
    const httpResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}`);
    const response = await httpResponse.json();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}`)
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
  };

  loadAdmins = async () => {
    const httpResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/admins`);
    const response = await httpResponse.json();
    if (response.result === "success") {
      this.setState({
        admins: response.data,
        loadingAdmins: false,
      });
    }
  };

  loadUsers = async () => {
    const httpResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${this.state.id}/members`);
    const response = await httpResponse.json()
    if (response.result === "success") {
      this.setState({
        users: response.data,
        loadingUsers: false,
      });
    }
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

  onSubmit = async () => {
    this.setState({ loadingGroupData: true });
    const httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      body: JSON.stringify(this.getGroupData())
    });
    const response = await httpResponse.json();
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
  };

  checkError = () => {
    return this.state.showError ? <ErrorText/> : null;
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
