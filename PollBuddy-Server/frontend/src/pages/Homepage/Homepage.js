import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import "./Homepage.scss";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";
import PollCode from "../../components/PollCode/PollCode";

export default class Homepage extends Component {

  componentDidMount() {
    this.props.updateTitle("Home");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <img src={logo} alt="logo" className="Homepage-logo img-fluid" />
        <MDBContainer className="Homepage-boxes two-box">
          <MDBContainer className="box">
            <p>
              Poll Buddy is an interactive questionnaire platform that aims to be an enjoyable and easy to use way to collect answers and insights from a group of people.
            </p>
            <MDBContainer>
              <Link to={"/login"}>
                <button className = "btn button">Login</button>
              </Link>
              <Link to={"/registerDefault"}>
                <button className = "btn button">Register</button>
              </Link>
            </MDBContainer>
          </MDBContainer>
          <PollCode/>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
