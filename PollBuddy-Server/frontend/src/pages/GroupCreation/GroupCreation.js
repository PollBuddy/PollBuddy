import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import { MDBContainer } from "mdbreact";
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

  componentDidMount(){
    this.props.updateTitle("Group Creation");
  }

  getGroupData = () => {
    return {
      name: this.state.name,
      description: this.state.description,
    };
  };

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    this.setState({showError: false});
    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      body: JSON.stringify(this.getGroupData())
    }).then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.result === "success") {
          this.props.router.navigate("/groups/" + response.data.id);
        } else {
          this.setState({showError: true});
        }
      });
  };

  checkError() {
    return this.state.showError ? <ErrorText/> : null;
  }

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
          {this.checkError()}
          <button className="button" onClick={this.onSubmit}>
            Create Group
          </button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
export default withRouter(GroupCreation);