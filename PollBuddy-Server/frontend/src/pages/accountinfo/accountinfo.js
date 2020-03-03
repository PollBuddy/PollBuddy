import React, { Component } from 'react';
import "./accountinfo.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class accountinfo extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
            <div className="top-bar">
              <img src="./img/Poll_Buddy_Logo_v4.png" alt="logo"></img>
              <div className="middle-text">
                  Account Info
              </div>
            </div>
              <div className="main-body">
                
              </div>
          </header>

        </MDBContainer>
      )
    }
}