import React, { Component } from 'react';
import "./accountinfo.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class accountinfo extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
          <link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet"></link>
            <div className="top-bar">
              <div className="header-text">
                <img src="Poll-Buddy-Logo.png" alt="logo" className="logo img-fluid"></img>
                  Account Info
                <img src="homeicon.png" alt="home" className="home img-fluid"></img>
              </div>              
            </div>
              <div className="main-body">
              </div>
          </header>

        </MDBContainer>
      )
    }
}