import React, { Component } from 'react';
import "./privacy.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer } from 'mdbreact';

export default class accountinfo extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
          <link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet"></link>
            <div className="top-bar">
              <div className="header-text">
                <img src="Poll-Buddy-Logo.png" alt="logo" className="logo img-fluid"></img>
                  Privacy
              </div>              
            </div>
            <div className="main-body text-center">
            <br></br>
                <div style={{fontSize: 50 + 'px'}}>From the contributers of Poll Buddy,</div> <br></br> <br></br>
                  Our promise is to keep your data safe, protected and far from anyone 
                  that could use it in a harmful way. <br></br>The purpose of this app is and always will be
                  for educational purposes <i>only</i>. 

            </div>
             
          </header>

        </MDBContainer>
      )
    }
}