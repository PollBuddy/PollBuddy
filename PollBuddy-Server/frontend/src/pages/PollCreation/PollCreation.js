import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { ErrorText, withRouter } from "../../components";

class PollCreation extends Component {//this class will likely need to call Groups/new and do more with that...
  constructor(props) {
    super(props);
    this.state = {
      groupID: props.router.searchParams.get("groupID"),
      title: "",
      description: "",
      showError: false,
      errors: [],
    };
  }

  componentDidMount(){
    this.props.updateTitle("Poll Creation");
  }

  getPollData = () => {
    return {
      title: this.state.title,
      description: this.state.description,
      group: this.state.groupID || undefined,
    };
  };

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    this.setState({showError: false});
    await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.getPollData())
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.result === "success") {
          this.props.router.navigate("/polls/" + response.data.id + "/edit");
        } else {
          this.setState({errors: response.error});
          this.setState({showError: true});
        }
      });
  };

  checkError() {
    if(this.state.errors.title === true && this.state.errors.description === true) {
      return this.state.showError ? <ErrorText text={"Must enter a title and description!"}/> : null;
    } else if(this.state.errors.title === true) {
      return this.state.showError ? <ErrorText text={"Must enter a title!"}/> : null;
    } else if(this.state.errors.description === true) {
      return this.state.showError ? <ErrorText text={"Must enter a description!"}/> : null;
    } else {
      return this.state.showError ? <ErrorText text={"An unknown error has occurred."}/> : null;
    }
  }

  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <label htmlFor="pollTitle">Poll Title:</label>
            <input
              name="title"
              id="pollTitle"
              placeholder="Title"
              className="form-control textBox"
              onInput={this.onInput}
            />
            <label htmlFor="pollDescription">Poll Description:</label>
            <input
              name="description"
              id="pollDescription"
              placeholder="Description"
              className="form-control textBox"
              onInput={this.onInput}
            />
          </MDBContainer>
          {this.checkError()}
          <button className="button" onClick={this.onSubmit}>
            Create Poll
          </button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(PollCreation);
