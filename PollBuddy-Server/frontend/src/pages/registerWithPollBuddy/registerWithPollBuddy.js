import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";

export default class registerWithPollBuddy extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Register with Poll Buddy
          </p>
          <p>
            To create an account, fill in the text boxes, then press submit.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="nameText">Name:</label>
            <input placeholder="SIS Man" className="form-control textBox" id="nameText"/>
            <label htmlFor="emailText">Email:</label>
            <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"/>
            <label htmlFor="passwordText">Password:</label>
            <input placeholder="●●●●●●●●●●●●" className="form-control textBox" id="passwordText"/>
          </MDBContainer>

          <form>
            <button className="btn button" formAction="/accountinfo">Submit</button>
          </form>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
