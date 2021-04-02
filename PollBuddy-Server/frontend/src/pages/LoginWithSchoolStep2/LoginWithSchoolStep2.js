import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Link } from "react-router-dom";
import ErrorText from "../../components/ErrorText/ErrorText";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";

export default class LoginWithSchoolStep2 extends Component {
  constructor(props) {
    super(props);

    // Process args
    if(this.props.location.search) {
      console.log("Getting things");
      var firstName = new URLSearchParams(this.props.location.search).get("firstName");
      var lastName = new URLSearchParams(this.props.location.search).get("lastName");
      var userName = new URLSearchParams(this.props.location.search).get("userName");
      console.log(firstName);
      console.log(lastName);
      console.log(userName);
    }

    // Set up the state
    this.state = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      doneLoading: true,
      error: null,
    };

  }

  componentDidMount() {
    this.props.updateTitle("Login With School Step 2");

  }

  render() {
    if (this.state.error != null) {
      alert(this.state.error);
      return ( //for some reason, this only shows up after clicking submit twice
        <ErrorText text={this.state.error}> </ErrorText>
      );
    } else if(!this.state.doneLoading){
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">

            <p>Logging in...</p>
            <p> {"firstName:" + this.state.firstName}</p>
            { /* TODO: The returned data from the backend needs to be handled and saved somewhere */ }
            { /* TODO: This page should redirect to a relevant location. This could be
                       1. Back to /login/school if something went wrong with the login process
                       2. To /register/school if the user is unregistered
                       3. To /groups if all went well
                       Each of these options should show a message to the user indicating what's happening.
             */ }

          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
