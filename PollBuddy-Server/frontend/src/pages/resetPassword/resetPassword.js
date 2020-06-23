import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import {Link} from "react-router-dom";

import "mdbreact/dist/css/mdb.css";

export default class resetPassword extends Component {

  componentDidMount() {
    this.props.updateTitle("Reset Password");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="width-90 fontSizeSmall">
            Enter the security code from your inbox and your new password.
          </p>
          <p className="width-90 fontSizeSmall">
            Security code:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="A9EM3FL8W" className="form-control textBox"/>
          </MDBContainer>
          <p className="width-90 fontSizeSmall">
            New password:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="******************" className="form-control textBox"/>
          </MDBContainer>
          <p className="width-90 fontSizeSmall">
            Confirm password:
          </p>
          <MDBContainer className="form-group">
            <input placeholder="******************" className="form-control textBox"/>
          </MDBContainer>

          <Link to={"/myclasses"}>
            <button className="btn button">Submit</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    )
  }
}
