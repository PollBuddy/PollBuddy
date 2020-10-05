import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

export default class AccountInfo extends Component {
  componentDidMount(){
    this.props.updateTitle("Account Info");
  }

  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <p>Your Name: SIS Man</p>
            <p>Your Email: mans@rpi.edu</p>
            <p>Location: Troy, NY</p>
            <p>Time Zone: EDT (UTC-4)</p>
          </MDBContainer>

          <Link to={"/login/forgot"}>
            <button className="btn button">Change password</button>
          </Link>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
