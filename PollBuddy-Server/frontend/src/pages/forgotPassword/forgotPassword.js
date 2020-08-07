import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class pollCode extends Component {

  componentDidMount() {
    this.props.updateTitle("Forgot Password");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            <b>Forgot Password?</b>
          </p>
          <p>
            Enter your email and we will send you a reset.
          </p>
          <p>
            <b>Email:</b>
          </p>

          <MDBContainer className="form-group">
            <input placeholder="Enter email" className="form-control textBox"/>
          </MDBContainer>
          <Link to={"/resetPassword"}>
            <button className="btn button">Reset Password</button>
          </Link>

        </MDBContainer>
      </MDBContainer>
    )
  }
}
