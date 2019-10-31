import React, {Component} from 'react';
import { MDBBtn, MDBIcon } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import logo from '../../logo.svg';

import './myclasses.scss'

export default class Myclasses extends Component {
  render() {

    return (
      <div className="page-my-classes">
          <img src={logo} className="top_left_logo" alt="logo"/>

          <font size="+3">My Classes</font>

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
              className="settings_button"
              href="/"
              color="secondary"
          >
            <MDBIcon icon="tools" />
          </MDBBtn>

        <hr></hr>



        <body>
        CSCI 1200
        </body>


        <div id="header-content">
          You have joined CSCI 1200
        </div>

      </div>
    )
  }
}