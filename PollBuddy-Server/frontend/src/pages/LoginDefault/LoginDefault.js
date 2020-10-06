import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class LoginDefault extends Component {
  componentDidMount() {
    this.props.updateTitle("Log in");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Login to Poll Buddy
          </p>
          <p className="width-90 fontSizeSmall">
            Click on one of the following buttons to login.
          </p>
          <Link to={"/login/pollbuddy"}>
            <button className="btn button">Login with Poll Buddy Account</button>
          </Link>

          <Link to={"/login/school"}>
            <button className="btn button">Login with School Account</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
