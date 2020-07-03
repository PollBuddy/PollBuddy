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
          <p className="width-90 fontSizeSmall" id="nameText">
            Name:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="SIS Man" className="form-control textBox" aria-labelledby="nameText"/>
          </MDBContainer>
          <p className="width-90 fontSizeSmall" id="emailText">
            Email:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="mans@rpi.edu" className="form-control textBox" aria-labelledby="emailText"/>
          </MDBContainer>
          <p className="width-90 fontSizeSmall" id="passwordText">
            Password:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="******************" className="form-control textBox" aria-labelledby="passwordText"/>
          </MDBContainer>

          <form>
            <button className="btn button" formAction="/accountinfo">Submit</button>
          </form>
        </MDBContainer>
      </MDBContainer>
    )
  }
}
