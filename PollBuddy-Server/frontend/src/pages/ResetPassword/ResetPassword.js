import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import {Link, withRouter} from "react-router-dom";


import "mdbreact/dist/css/mdb.css";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    if(this.props.location.search) {
      var resetCode = new URLSearchParams(this.props.location.search).get("resetcode");
      var resetCodePrefilled = true;

      if(resetCode == null) {resetCode = ""; resetCodePrefilled = false; }
    }

    this.state = {
      resetCode: resetCode,
      resetCodePrefilled: resetCodePrefilled,
    };

  }

  componentDidMount() {
    this.props.updateTitle("Reset Password");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p>
            Enter the security code from your inbox and your new password.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="securityCodeText">Security code:</label>
            <input placeholder="A9EM3FL8W" className="form-control textBox" id="securityCodeText"
              value = {this.state.resetCode} readOnly={this.state.resetCodePrefilled}/>
            <label htmlFor="newPasswordText">New password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"/>
            <label htmlFor="confirmPasswordText">Confirm password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmPasswordText"/>
          </MDBContainer>

          <Link to={"/Groups"}>
            <button className="button">Submit</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(ResetPassword);
