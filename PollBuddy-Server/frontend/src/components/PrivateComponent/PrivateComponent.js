import React from "react";
import {Navigate} from "react-router-dom";
import { withRouter } from "../PropsWrapper/PropsWrapper";

// Private component is used to redirect users based on if the are logged in or not.
// Pass in state = {true} if the user needs to be logged in to access a route.
// Pass in state = {false} if the user needs to be logged out to access a route.
// If it doesn't matter whether the user is logged in or not, don't use PrivateComponent.
class PrivateComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn === this.props.state) {
      return this.props.element;
    } else if(this.props.state){
      return <Navigate state={{prevRoute: this.props.router.location.pathname}} to={"/login"}/>;
    } else {
      return <Navigate to={"/"}/>;
    }
  }
}

export default withRouter(PrivateComponent);
