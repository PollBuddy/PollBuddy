import React, {Component} from 'react';
import { MDBBtn, MDBIcon } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import new_logo from '../../new_logo.jpg';
import './myclasses.scss'

export default class Myclasses extends Component {
  render() {

    return (
      <div className="page-my-classes">
          <img src={new_logo} className="top_left_logo" alt="logo"/>

          <font size="+3">CSCI 1200</font>

          <MDBBtn
            size="sm"
            className="home_button"
            href="/"
            color="secondary"
          >
            <MDBIcon icon="question" />
          </MDBBtn>

          <MDBBtn
              size="sm"
              className="settings_button"
              href="/"
              color="secondary"
          >
            <MDBIcon icon="tools" />
          </MDBBtn>

        <hr></hr>

        <body>
        Questions will be displayed here.
        </body>



        <div id="header-content" className="info_text">
          You have joined CSCI 1200.
        </div>

          <MDBBtn
              href="https://rcos.io/"
              className="rcos_button"
              target="_blank"
              size="sm"
              color="secondary"
          >
              An RCOS Project
          </MDBBtn>

          <MDBBtn
              href="https://info.rpi.edu/statement-of-accessibility"
              className="accessibility_button"
              target="_blank"
              size="sm"
              color="secondary"
          >
              Statement of Accessibility
          </MDBBtn>

          <MDBBtn
              href="https://github.com/neha-deshpande001/PollBuddy"
              className="github_button"
              target="_blank"
              size="sm"
              color="secondary"
          >
              Github
          </MDBBtn>

      </div>
    )
  }
}