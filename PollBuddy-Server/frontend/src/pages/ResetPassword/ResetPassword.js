import React, {Component} from "react";
import {MDBContainer} from "mdbreact";

import {Link} from "react-router-dom";
import "./ResetPassword.scss";

import "mdbreact/dist/css/mdb.css";

import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleLogOutCheck = this.handleLogOutCheck.bind(this);
    this.attemptPasswordReset = this.attemptPasswordReset.bind(this);

    this.state = {
      logOutCheck: true,
      resetCode: "",
      userName: "",
      newPassword: "",
      confirmedPassword: "!",
    };
  }

  handleLogOutCheck() {
    this.setState({logOutCheck: !this.state.logOutCheck});
  }

  componentDidMount() {
    this.props.updateTitle("Reset Password");
  }

  attemptPasswordReset(){
    console.log("pass :" + this.state.newPassword);
    console.log("code :" + this.state.resetCode);
    console.log("name :" + this.state.userName);
    if(this.newPassword === this.confirmedPassword){
      fetch(process.env.REACT_APP_BACKEND_URL + "/users/forgotpassword/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
        body: JSON.stringify({
          "resetPasswordToken" : this.state.resetCode,
          "username" : this.state.userName,
          "password" : this.state.newPassword,
          })
        }).then(
          value => {
            if(!(value.result === "success")){
              console.log(value.result);
            }
          },
          err => {console.log(err)}
        )
    }else {
      console.log("new and confirmed passwords do not match");
    }
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
              onChange={(e) => this.setState({resetCode : e.target.value})}/>
            
            <label htmlFor="userName" >UserName:</label>
            <input className="form-control textBox" id="userNameText"
              onChange={(e) => this.setState({userName : e.target.value})}/>

            <label htmlFor="newPasswordText">New password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="newPasswordText"
              onChange={(e) => this.setState({newPassword : e.target.value})}/>
            
            <label htmlFor="confirmPasswordText">Confirm password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="confirmPasswordText"
              onChange={(e) => this.setState({confirmedPassword : e.target.value})}/>
            
            <div id="logOutEverywhereContainer">
              <input type="checkbox" onChange={this.handleLogOutCheck} className="logOutBox" id="logOutEverywhere" checked={this.logOutCheck}/>
              <label className="logOutLabel" for="logOutEverywhere">Log out everywhere</label>
            </div>
          </MDBContainer>

          <button className="button" onClick={this.attemptPasswordReset}>Submit</button>
          <Link to={"/Groups"}>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(ResetPassword);