import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
    };
  }

  componentDidMount() {
    this.props.updateTitle("Forgot Password");
  }

  async requestReset() {
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/forgotpassword/submit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"email": this.state.emailInput})
    });
    let response = await httpResponse.json();
    if (response.result === "success") {
      this.props.router.navigate("/login/reset");
    } else {
      console.log("failed to update data");
    }
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <h1>Forgot Your Password?</h1>
          <p>
            Enter your email and we will send you a reset.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="emailText">Email:</label>
            <input placeholder="Enter email" className="form-control textBox" id="emailText"
              onChange={(e) => this.setState({emailInput: e.target.value})}/>
          </MDBContainer>
          <button className="button" onClick={this.requestReset}>Reset Password</button>

        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(ForgotPassword);
