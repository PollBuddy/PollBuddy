import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import {Link} from "react-router-dom";
import './ResetPassword.scss';

import "mdbreact/dist/css/mdb.css";

export default class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {logOutCheck: true};
    this.handleLogOutCheck = this.handleLogOutCheck.bind(this);
  }

  handleLogOutCheck() {
    this.setState({logOutCheck: !this.state.logOutCheck});
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
            <input placeholder="A9EM3FL8W" className="form-control textBox" id="securityCodeText"/>
            <label htmlFor="newPasswordText">New password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"/>
            <label htmlFor="confirmPasswordText">Confirm password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmPasswordText"/>
            <div id="logOutEverywhereContainer">
              <input type="checkbox" onChange={this.handleLogOutCheck} className="logOutBox" id="logOutEverywhere" checked={this.logOutCheck}/>
              <label className="logOutLabel" for="logOutEverywhere">Log out everywhere</label>
            </div>
          </MDBContainer>

          <Link to={"/Groups"}>
            <button className="button">Submit</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
