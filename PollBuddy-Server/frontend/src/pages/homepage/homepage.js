import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import "./homepage.scss";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";

export default class homepage extends Component {

  componentDidMount(){
    this.props.updateTitle("Home");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <img src={logo} alt="logo" className="homepage_logo img-fluid" />

        <p className="width-45 fontSizeSmall">
          Poll Buddy is an interactive questionnaire platform that aims to be an enjoyable and easy to use way to
          collect answers and insights from a group of people.
        </p>
        <MDBContainer>
          <Link to={"/login"}>
            <button className = "btn button">Login</button>
          </Link>
          <Link to={"/registerDefault"}>
            <button className = "btn button">Register</button>
          </Link>
        </MDBContainer>

        <p className="width-45 fontSizeSmall"> Already have a Poll Code? Enter it here.</p>
        <p className="width-45 fontSizeSmall"> 
          <label htmlFor="pollCodeText">Poll Code:</label>
        </p>

        <MDBContainer className="form-group">
          <input placeholder="K30SW8" className="form-control textBox" id="pollCodeText"/>
        </MDBContainer>

        <Link to={"/pollviewer"}>
          <button className = "btn button">Join Poll</button>
        </Link>

      </MDBContainer>
    );
  }
}
