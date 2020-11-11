import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import "./Homepage.scss";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import {Link, Redirect} from "react-router-dom";
import cookie from 'react-cookies'

export default class Homepage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: "testcode", 
      valid: false, 
      errMsg: "",
      loggedIn: cookie.load('loggedIn') || false
    };

    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  componentDidMount() {
    this.props.updateTitle("Home");
  }

  handleCodeChange(event) {
    // gets code string from input
    const code = event.target.value;
    this.setState({code: code});

    const validCodeRegex = RegExp(/^[a-zA-z0-9]{6}$/);
    this.setState({valid: validCodeRegex.test(code)});
  }

  submitCode() {
    // set error message if input is invalid
    this.setState({errMsg: 
      !this.state.valid ? "Code must be 6 characters, A-Z, 0-9" : ""});
  }

  render() {
    if(this.state.loggedIn) { // Gets login cookie and redirects if true
      return (
        <Redirect to="/groups" />
      );
    }

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
              <Link to={"/register"}>
                <button className = "btn button">Register</button>
              </Link>
            </MDBContainer>
          </MDBContainer>
          <MDBContainer className="box">
            <MDBContainer className="form-group">
              <label htmlFor="pollCodeText">Already have a Poll Code? Enter it here:</label>
              <input placeholder="K30SW8" onChange={this.handleCodeChange} className="form-control textBox"/>
              <p style={{color: "red", textAlign: "center"}}>{this.state.errMsg}</p>
            </MDBContainer>
            <Link to={this.state.valid ? "/poll/" + this.state.code + "/view" : ""}>
              <button className = "btn button" onClick={this.submitCode}>
                  Join Poll
              </button>
            </Link>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
