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
            <b>Register with Poll Buddy</b>
          </p>
          <p>
            To create an account, fill in the text boxes, then press submit.
          </p>
          <p>
            Name:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="SIS Man" className="form-control textBox"/>
          </MDBContainer>
          <p>
            Email:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="mans@rpi.edu" className="form-control textBox"/>
          </MDBContainer>
          <p>
            Password:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="******************" className="form-control textBox"/>
          </MDBContainer>

          <form>
            <button className="btn button" formAction="/accountinfo">Submit</button>
          </form>
        </MDBContainer>
      </MDBContainer>
    )
  }
}
