import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import { withRouter } from "../../components/PropsWrapper/PropsWrapper";

class ForgotPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      emailInput : "",
    };
    this.requestReset = this.requestReset.bind(this);
  }

  componentDidMount() {
    this.props.updateTitle("Forgot Password");
  }

  requestReset(){
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/forgotpassword/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      body: JSON.stringify({"email" : this.state.emailInput})
    }).then(
      val => {
        if(!(val.result === "success")){
          console.log("failed to update data")
        }
      },
      err => {console.log(err);}
    )
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
            <input placeholder="Enter email" className="form-control textBox" id="emailText" onChange={(e)=> this.setState({emailInput:e.target.value})}/>
          </MDBContainer>
          <Link to={"/login/reset"}>
            <button className="button" onClick={this.requestReset}>Reset Password</button>
          </Link>

        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(ForgotPassword);
