import React from "react";
import {Navigate} from "react-router-dom";
import { withRouter } from "../PropsWrapper/PropsWrapper";

class PrivateComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn === this.props.state) {
      return this.props.element;
    } else if(this.props.state){
      return <Navigate state={{prevRoute: this.props.router.location.pathname}} to={"/login"}/>
    } else {
      return <Navigate to={"/"}/>
    }
  }
}

export default withRouter(PrivateComponent);
