import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Link } from "react-router-dom";

import SchoolPicker from "../../components/SchoolPicker/SchoolPicker";

export default class RegisterWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with School");
  }

  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Register with School
          </p>
          <p>
            To create an account, enter your school name or login using RPI's CAS.
          </p>
          <p>
            { /* TODO: Add label here */}
            School Name:
          </p>

          <SchoolPicker
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={value => this.setState({ value })}
          />

          <Link to={"/account"}>
            <button className="btn button">Submit School Name</button>
          </Link>

          <form>
            <button className="btn button"
              formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F">
              CAS (I'm an RPI student)
            </button>
          </form>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
