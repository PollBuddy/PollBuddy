import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

import SchoolPicker from "../../components/SchoolPicker/SchoolPicker";

export default class registerWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Login With School");
  }

  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Login with School
          </p>
          <p className="fontSizeSmall">
            To login, enter your school name or login using RPI's CAS.
          </p>
          <p className="fontSizeSmall" id="schoolNameText">
            School Name:
          </p>

          <SchoolPicker
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={value => this.setState({ value })}
          />

          <Link to={"/accountinfo"}>
            <button className="button">Submit</button>
          </Link>

          <form>
            <button className="button"
              formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F">
              CAS (I'm an RPI student (TODO: Integrate with school selector))
            </button>
          </form>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
