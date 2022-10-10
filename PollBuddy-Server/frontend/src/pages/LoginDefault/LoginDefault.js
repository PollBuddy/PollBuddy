import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import { withRouter } from "../../components";

class LoginDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.updateTitle("Log in");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Login to Poll Buddy
          </p>
          <p className="fontSizeSmall">
            Click on one of the following buttons to login.
          </p>
          <Link to={"/login/pollbuddy"} state={this.props.router.location.state}>
            <button className="button">Login with Poll Buddy Account</button>
          </Link>

          <Link to={"/login/school"}>
            <button className="button">Login with School Account</button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(LoginDefault);
