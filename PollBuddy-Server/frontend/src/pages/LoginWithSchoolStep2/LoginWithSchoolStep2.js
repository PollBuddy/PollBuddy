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

      var result = new URLSearchParams(this.props.location.search).get("result");
      var data = JSON.parse(new URLSearchParams(this.props.location.search).get("data"));
      var error = JSON.parse(new URLSearchParams(this.props.location.search).get("error"));

    }

    // Set up the state
    this.state = {
      result: result,
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      error: error,
      doneLoading: true,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Login With School Step 2");
  }

  render() {
    if (this.state.result === "failure") {
      alert(this.state.error);
      if(this.state.error === "User is not registered"){
        console.log("Error: " + this.state.error);
        // Redirect to register page
        this.props.history.push("/register/school");
      } else if(this.state.error === "User has not logged in with RPI."){
        console.log("Error: " + this.state.error);
        // Redirect to login page
        this.props.history.push("/login/school");
      } else { //database error - show the ErrorText component
        return ( //for some reason, this only shows up after clicking submit twice
          <ErrorText text={this.state.error}> </ErrorText>
        );
      }
    } else if(!this.state.doneLoading){
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      alert("everything worked!!!!");
      console.log("everything worked; redirecting to /groups");
      this.props.history.push("/groups");

      //ideally we'll never get here
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">

            <p>Logging in...</p>

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
