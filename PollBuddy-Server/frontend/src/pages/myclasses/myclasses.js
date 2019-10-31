import React, {Component} from 'react';
import { MDBBtn } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';

import homepage from '../homepage'
import logo from '../../logo.svg';

import './myclasses.scss'

export default class Myclasses extends Component {
  render() {

    return (
      <div className="page-my-classes">
          <homepage></homepage>{}
        <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <p1>
          My Classes
        </p1>
        <MDBBtn
            href="/"
            color="secondary"
        >
            HOME
        </MDBBtn>


        <body>
          body
        </body>

          </div>
      </div>
    )
  }
}