import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import "./Homepage.scss";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";

export default class Homepage extends Component {

  componentDidMount(){
    this.props.updateTitle("Home");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <img src={logo} alt="logo" className="homepage_logo img-fluid" />
        <MDBContainer className="home_boxes two-box">
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
          <MDBContainer className="box">
            <p>Already have a Poll Code? Enter it here.</p>

            <MDBContainer className="form-group">
              <label htmlFor="pollCodeText">Poll Code:</label>
              <input placeholder="K30SW8" className="form-control textBox"/>
            </MDBContainer>


            <Link to={"/poll/:pollID/view"}>
              <button className = "btn button">Join Poll</button>
            </Link>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
