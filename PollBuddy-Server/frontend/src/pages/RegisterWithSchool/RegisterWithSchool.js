import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

import SchoolPicker, {schoolLinkDict} from "../../components/SchoolPicker/SchoolPicker";

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
            To create an account, select your school name.
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

          <form>
            <button className="btn button" formAction={ "/api/users/register/" + schoolLinkDict[this.state.value] }>Submit</button>
          </form>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
