import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Footer.scss";
import rcosLogo from "../../images/rcos.png";
import githubLogo from "../../images/github.png";
import {MDBContainer} from "mdbreact";
import { Link } from "react-router-dom";

const ACCESS_LINK = "https://info.rpi.edu/statement-of-accessibility";
const RCOS_LINK = "https://rcos.io/";
const GITHUB_LINK = "https://github.com/PollBuddy/PollBuddy";

export default class Footer extends Component {
  render() {
    return (
      <footer className="Footer-foot">
        <MDBContainer className="Footer-foot-links">
          <span>
            <Link to="/about">About</Link>
            <a href={ACCESS_LINK} target="_blank" rel="noopener noreferrer">
              Accessibility
            </a>
          </span>
          <span>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy">Privacy</Link>
          </span>
        </MDBContainer>
        <MDBContainer className="Footer-foot-links Footer-copy">
          <span>&copy; 2019-{new Date().getFullYear()} Poll Buddy</span>
        </MDBContainer>
        <MDBContainer className="Footer-foot-links">
          <a href={RCOS_LINK} target="_blank" rel="noopener noreferrer">
            <img src={rcosLogo} alt="RCOS" />
          </a>
          <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="Github" />
          </a>
        </MDBContainer>
      </footer>
    );
  }
}
