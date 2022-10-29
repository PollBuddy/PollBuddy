import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "./ResetPassword.scss";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logOutCheck: true,
      errorText: "",
      resetCode: "",
      userName: "",
      newPassword: "",
      confirmedPassword: "!",
    };
  }

  componentDidMount() {
    this.props.updateTitle("Reset Password");
  }

  handleLogOutCheck = () => {
    this.setState({logOutCheck: !this.state.logOutCheck});
  };

  attemptPasswordReset = async () => {
    this.setState({errorText: ""});
    if (this.state.newPassword === this.state.confirmedPassword) {
      let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/forgotpassword/change", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "resetPasswordToken": this.state.resetCode,
          "username": this.state.userName,
          "password": this.state.newPassword,
        })
      });
      let response = httpResponse.json();
      if (response.result === "success") {
        const {router} = this.props;
        router.navigate("/");
      } else {
        this.setState({errorText: response.error});
      }
    } else {
      this.setState({errorText: "New and confirmed passwords do not match."});
    }
  };

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
              onChange={(e) => this.setState({resetCode: e.target.value})}/>
            <label htmlFor="userName">UserName:</label>
            <input className="form-control textBox" id="userNameText"
              onChange={(e) => this.setState({userName: e.target.value})}/>
            <label htmlFor="newPasswordText">New password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"
              onChange={(e) => this.setState({newPassword: e.target.value})}/>
            <label htmlFor="confirmPasswordText">Confirm password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmPasswordText"
              onChange={(e) => this.setState({confirmedPassword: e.target.value})}/>
            <div id="logOutEverywhereContainer">
              <input type="checkbox" onChange={this.handleLogOutCheck} className="logOutBox" id="logOutEverywhere"
                checked={this.logOutCheck}/>
              <label className="logOutLabel" htmlFor="logOutEverywhere">Log out everywhere</label>
            </div>
            <p style={{color: "red"}}>{this.state.errorText}</p>
          </MDBContainer>
          <button className="button" onClick={this.attemptPasswordReset}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(ResetPassword);