import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./footer.scss";
import rcosLogo from "../../rcos.png";
import githubLogo from "../../github.png"

export default class Footer extends Component {
  render() {
    return (
      <footer className = "foot">
        <div className = "linethru" />
        <div className = "logo_links">
          <a href = "https://rcos.io/" target = "_blank" rel="noopener noreferrer">
            <img src = {rcosLogo} alt = "RCOS" />
          </a>
          <a href = "https://github.com/PollBuddy/PollBuddy" target = "_blank" rel="noopener noreferrer">
            <img src = {githubLogo} alt = "Github" />
          </a>
        </div>
        <div className = "foot_links">
          <a href = "/">
						About
          </a>
          <a href = "https://info.rpi.edu/statement-of-accessibility" target = "_blank" rel = "noopener noreferrer">
						Accessibility
          </a>
          <a href = "mailto:someemail@yeah.com">
						Contact
          </a>
          <a href = "/privacy">
						Privacy
          </a>
        </div>
      </footer>
    )
  }
}
