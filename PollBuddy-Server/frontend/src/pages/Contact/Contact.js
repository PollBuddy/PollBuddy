import React, { Component } from "react";
import autosize from "autosize";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

import SchoolPicker from "../../components/SchoolPicker/SchoolPicker";

export default class Contact extends Component {

  componentDidMount() {
    this.props.updateTitle("Contact Us");
    autosize(document.querySelector("textarea"));
  }

  constructor(props) {
    super(props);
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
    }).then(response => response.json())
      // handle response
      .then(data => {
        this.setState({fullName: data.data.FirstName+ " " +data.data.LastName, value: data.data.SchoolAffiliation, email: data.data.Email});
      });
    this.state = {
      formUp: false,
      done: false,
      email: "",
      value: "",
      fullName: "",
      descriptionOfIssue: ""
    };
  }

  handleSendTicket() {
    this.setState({ formUp: false, done : true });
  }

  render() {
    this.handleSendTicket = this.handleSendTicket.bind(this);

    return(
      <MDBContainer fluid className="page">
        <MDBContainer className = "box">
          <p className="fontSizeLarge">
            Looking to get in touch with a developer? Shoot an email over to <a href="mailto:contact@pollbuddy.app">contact@pollbuddy.app</a> or click the button below to open a support ticket form.
          </p>
          <p>
            Alternatively, it would be greatly appreciated if you reported technical
            problems, such as bugs or design complaints/suggestions, by <a href="https://github.com/PollBuddy/PollBuddy/issues/new/choose">opening an issue</a> on our <a href="https://github.com/PollBuddy/PollBuddy">GitHub repository.</a>
          </p>
          <button
            className="button"
            style={{ display: this.state.formUp ? "none" : ""}}
            onClick={() => this.setState({ formUp: true, done: false })}
          >
            File Support Ticket
          </button>
        </MDBContainer>
        <MDBContainer fluid className="box"
          style={{ display: this.state.formUp ? "flex" : "none", width: "50%" }}
        >
          <p className="fontSizeLarge">Support Ticket Information</p>
          <MDBContainer className="form-group">
            <label htmlFor="name">Full name:</label>
            <input required
              className="form-control textBox"
              id="name"
              placeholder="Name"
              value={this.state.fullName}
              onChange={(evt) => { this.setState({fullName: evt.target.value}); }}
            />
            <label htmlFor="school">School (if applicable):</label>
            <SchoolPicker
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
              onSelect={value => this.setState({ value })}
            />
            <label htmlFor="email">Email:</label>
            <input required
              className="form-control textBox"
              id="email"
              placeholder="Email"
              value={this.state.email}
              onChange={(evt) => { this.setState({email: evt.target.value}); }}
            />
            <label htmlFor="description">Description of the issue:</label>
            <textarea required
              className="form-control textBox"
              id="description"
              maxLength="500"
              placeholder="500 character limit"
              onChange={(evt) => {
                this.setState({descriptionOfIssue: evt.target.value});
              }}
            />
            <button className="button" onClick={this.handleSendTicket}>
              Send Ticket
            </button>
          </MDBContainer>
        </MDBContainer>
        <MDBContainer fluid className = "box"
          style={{ display: this.state.done ? "flex" : "none", width: "50%" }}
        >
          <p className = "fontSizeLarge">
            Thank you for your support! Your form has been submitted. If you have any other issues, please file another support form.
          </p>
        </MDBContainer>
      </MDBContainer>
    );
  }

}
