import React, { Component } from 'react';
import "./privacy.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Header from "../../components/header/header.js"

export default class accountinfo extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
          <link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet"></link>

          <Header title = "Privacy" btn = "account" />
            <div className="main-body text-center">
            <br></br>
            <MDBRow>  
              <MDBCol sm="10">
                  <div className="top">
                      From the contributers of Poll Buddy,
                  </div>
                  <br></br>
                  <div className="body-words">
                    Our promise is to keep your data safe, protected and far from anyone 
                    that could use it in a harmful way. <br></br>The purpose of this app is and always will be
                    for educational purposes <i>only</i>. 
                  </div>
              </MDBCol>

            </MDBRow>                  

            </div>
             
          </header>

        </MDBContainer>
      )
    }
}