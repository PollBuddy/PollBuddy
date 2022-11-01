import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import {MDBContainer} from "mdbreact";
import ErrorText from "../../components/ErrorText/ErrorText";

class GroupCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      showError: false,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Group Creation");
  }

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    this.setState({showError: false});
    const httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/new", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: this.state.name,
        description: this.state.description,
      })
    });
    const response = await httpResponse.json();
    if (response.result === "success") {
      this.props.router.navigate("/groups/" + response.data.id);
    } else {
      this.setState({showError: true});
    }
  };

  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <label htmlFor="groupName">Group Name:</label>
            <input
              name="name"
              id="groupName"
              className="form-control textBox"
              onInput={this.onInput}
            />
            <label htmlFor="groupName">Group Description:</label>
            <input
              name="description"
              id="groupDescription"
              className="form-control textBox"
              onInput={this.onInput}
            />
          </MDBContainer>
          <ErrorText show={this.state.showError}/>
          <button className="button" onClick={this.onSubmit}>
            Create Group
          </button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(GroupCreation);
