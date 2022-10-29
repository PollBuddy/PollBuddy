import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import ErrorText from "../../components/ErrorText/ErrorText";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {Navigate} from "react-router-dom";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class LoginWithSchoolStep2 extends Component {
  constructor(props) {
    super(props);

    // Process args
    // TODO: Some of this should probably be in a try/catch or something for robustness
    if (this.props.router.location.search) {
      console.log("Getting things");
      let result = new URLSearchParams(this.props.router.location.search).get("result");
      let data = JSON.parse(new URLSearchParams(this.props.router.location.search).get("data"));
      let error = new URLSearchParams(this.props.router.location.search).get("error");

      // Set up the state
      if (error) {
        this.state = {
          result: result,
          error: error,
          doneLoading: true,
        };
      } else {
        this.state = {
          result: result,
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          doneLoading: true,
        };
      }
    } else {
      console.log("Failed to locate search parameters");
      this.state = {
        result: "failure",
        error: "Failed to load data from the URL.",
        doneLoading: true,
      };
    }
  }

  componentDidMount() {
    this.props.updateTitle("Login With School Step 2");
  }

  render() {
    if (this.state.result === "failure") {
      if (this.state.error === "User is not registered.") {
        console.log("Error: " + this.state.error);
        alert("Error: You are not registered! Redirecting to registration page...");
        // Redirect to register page
        return (<Navigate to="/register/school" push={true}/>);
      } else if (this.state.error === "User has not logged in with RPI.") {
        console.log("Error: " + this.state.error);
        alert("Error: Something went wrong with the school login process. Please try again, redirecting to login page...");
        // Redirect to login page
        return (<Navigate to="/login/school" push={true}/>);
      } else { //database error - show the ErrorText component
        alert("Error: Something went wrong. Details: " + this.state.error);
        return ( //for some reason, this only shows up after clicking submit twice
          <ErrorText text={this.state.error}> </ErrorText>
        );
      }
    } else if (!this.state.doneLoading) {
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      // Save data about the user
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("firstName", this.state.firstName);
      localStorage.setItem("lastName", this.state.lastName);
      localStorage.setItem("userName", this.state.userName);

      console.log("everything worked; redirecting to /groups");
      return (<Navigate to="/groups" push={true}/>);
    }
  }
}

export default withRouter(LoginWithSchoolStep2);
