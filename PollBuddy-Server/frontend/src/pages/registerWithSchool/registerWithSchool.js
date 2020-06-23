import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class registerWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with School");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Register with School
          </p>
          <p className="width-90 fontSizeSmall">
            To create an account, enter your school name or login using RPI's CAS.
          </p>
          <p className="width-90 fontSizeSmall">
            School Name:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="Enter school name" className="form-control textBox"/>
          </MDBContainer>

          <Link to={"/accountinfo"}>
            <button className="btn button">Submit School Name</button>
          </Link>

          <form>
            <button className="btn button"
              formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F">CAS
              (I'm an RPI student)
            </button>
          </form>


        </MDBContainer>
      </MDBContainer>
    )
  }
}
