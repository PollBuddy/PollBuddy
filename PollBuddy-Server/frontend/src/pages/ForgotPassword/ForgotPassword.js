import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class ForgotPassword extends Component {

  componentDidMount() {
    this.props.updateTitle("Forgot Password");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Forgot Password?
          </p>
          <p>
            Enter your email and we will send you a reset.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="emailText">Email:</label>
            <input placeholder="Enter email" className="form-control textBox" id="emailText"/>
          </MDBContainer>
          <Link to={"/login/reset"}>
            <button className="button">Reset Password</button>
          </Link>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
