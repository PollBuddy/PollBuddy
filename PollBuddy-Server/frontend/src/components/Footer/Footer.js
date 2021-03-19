import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Footer.scss";
import rcosLogo from "../../images/rcos.png";
import githubLogo from "../../images/github.png";
import {MDBContainer} from "mdbreact";

export default class Footer extends Component {
  render() {
    return (
      <footer className = "Footer-foot">
        <MDBContainer className = "Footer-foot-links">
          <span><a href = "/about">
            About
          </a>
          <a href = "https://info.rpi.edu/statement-of-accessibility" target = "_blank" rel = "noopener noreferrer">
            Accessibility
          </a></span>
          <span><a href = "/contact">
            Contact
          </a>
          <a href = "/faq">
            FAQ
          </a>
          <a href = "/privacy">
            Privacy
          </a></span>
        </MDBContainer>
        <MDBContainer className = "Footer-foot-links Footer-copy">
          <span>&copy; 2020 Poll Buddy</span>
        </MDBContainer>
        <MDBContainer className = "Footer-foot-links">
          <a href = "https://rcos.io/" target = "_blank" rel="noopener noreferrer">
            <img src = {rcosLogo} alt = "RCOS" />
          </a>
          <a href = "https://github.com/PollBuddy/PollBuddy" target = "_blank" rel="noopener noreferrer">
            <img src = {githubLogo} alt = "Github" />
          </a>
        </MDBContainer>
      </footer>
    );
  }
}
