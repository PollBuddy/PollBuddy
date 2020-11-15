import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Link } from "react-router-dom";

import SchoolPicker from "../../components/SchoolPicker/SchoolPicker";

export default class LoginWithSchool extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.schools = [];
    this.schoolLinkDict = {};
    fetch(process.env.REACT_APP_BACKEND_URL + "/schools", {
      method: "GET",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
    }).then(response => response.json())
      // handle response
      .then(data => {
        console.log(data); // for testing, can be deleted later
        this.schoolLinkDict = data;
        const schoolNames = Object.keys(data);
        console.log(schoolNames); // for testing, can be deleted later
        for (var i = 0; i < schoolNames.length; i++) {
          this.schools.push({ key: i, label: schoolNames[i] });
        }
        console.log(this.schools); // for testing, can be deleted later
      })
      .catch(err => {
        this.setState({ error: "An error occurred during login. Please try again" });
      });
  }

  componentDidMount() {
    this.props.updateTitle("Login With School");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Login with School
          </p>
          <p className="width-90 fontSizeSmall">
            To login, enter your school name or login using RPI's CAS.
          </p>
          <p className="width-90 fontSizeSmall" id="schoolNameText">
            School Name:
          </p>

          <SchoolPicker
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={value => this.setState({ value })}
            schools={this.schools}
          />
          <form>
            <button className="btn button" formAction={this.schoolLinkDict[this.state.value]}>Submit</button>
          </form>

          {/* <form>
            <button className="btn button"
              formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F">
              CAS (I'm an RPI student (TODO: Integrate with school selector))
            </button>
          </form> */}

        </MDBContainer>
      </MDBContainer>
    );
  }
}
