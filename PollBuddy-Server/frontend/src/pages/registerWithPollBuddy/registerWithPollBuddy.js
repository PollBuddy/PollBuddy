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
          <p className="bold fontSizeLarge">
            Register with Poll Buddy
          </p>
          <p className="width-90 fontSizeSmall">
            To create an account, fill in the text boxes, then press submit.
          </p>
          <p className="width-90 fontSizeSmall">
            <label htmlFor="nameText">Name:</label>
          </p>
          <MDBContainer className="form-group">
            <input placeholder="SIS Man" className="form-control textBox" id="nameText"/>
          </MDBContainer>
          <p className="width-90 fontSizeSmall">
            <label htmlFor="emailText">Email:</label>
          </p>
          <MDBContainer className="form-group">
            <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"/>
          </MDBContainer>
          <p className="width-90 fontSizeSmall">
            <label htmlFor="passwordText">Password:</label>
          </p>
          <MDBContainer className="form-group">
            <input placeholder="******************" className="form-control textBox" id="passwordText"/>
          </MDBContainer>

          <form>
            <button className="btn button" formAction="/accountinfo">Submit</button>
          </form>
        </MDBContainer>
      </MDBContainer>
    )
  }
}
