import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class registerDefault extends Component {
  componentDidMount() {
    this.props.updateTitle("Register");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Register for Poll Buddy
          </p>
          <p className="width-90 fontSizeSmall">
            Click on one of the following buttons to register.
          </p>
          <Link to={"/registerWithSchool"}>
            <button className="btn button">Register with School</button>
          </Link>

          <Link to={"/registerWithPollBuddy"}>
            <button className="btn button">Register with Poll Buddy</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    )
  }
}
