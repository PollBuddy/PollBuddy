import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ErrorText from "../../components/ErrorText/ErrorText";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

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

  componentDidMount() {
    this.props.updateTitle("Poll Creation");
  }

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = async () => {
    this.setState({showError: false});
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/new", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description,
        group: this.state.groupID || undefined,
      })
    });
    let response = httpResponse.json();
    if (response.result === "success") {
      this.props.router.navigate("/polls/" + response.data.id + "/edit");
    } else {
      this.setState({showError: true});
    }
  };

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
          <ErrorText show={this.state.showError}/>
          <button className="button" onClick={this.onSubmit}>
            Create Poll
          </button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(PollCreation);
