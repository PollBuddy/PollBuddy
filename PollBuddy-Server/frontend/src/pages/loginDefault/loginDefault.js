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
            Log in to PollBuddy
          </p>
          <p className="width-90 fontSizeSmall">
            Click on one of the following buttons to login.
          </p>
          <Link to={"/login"}>
            <button className="btn button">Login with PollBuddy Account</button>
          </Link>

          <form>
            <button className="btn button"
              formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F">
              Login with RPI Account
            </button>
          </form>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
