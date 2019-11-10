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

          {/*<font size="+1">CSCI 1200</font>*/}

          <MDBBtn
            size="sm"
            className="home_button"
            href="/"
            color="secondary"
          >
            <MDBIcon icon="home" />
          </MDBBtn>

          <MDBBtn
              size="sm"
              className="about_button"
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

        <hr class="line_style"></hr>

        <header>
            CSCI 1200
        </header>
        <body className="body_style">
        <br />
        Lorem ipsum dolor sit amet, vel detracto scriptorem id, iudico menandri ei eum. Et duis augue utamur usu. At rebum semper mei. Cu laudem salutandi pro, assum persecuti vis cu. Quo ei cetero prompta, ad summo altera labores per.

        Ut nam wisi dolor menandri. In eligendi atomorum praesent est, blandit copiosae iudicabit usu an, in est etiam reprimique. Ea nostrud eripuit usu. Mea elitr oporteat instructior ex, usu alterum equidem ex. In etiam affert vel, ignota populo cu mel. Omnis sapientem eloquentiam et sea, detracto appareat dignissim est ei, est deseruisse persequeris definitiones ad.

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