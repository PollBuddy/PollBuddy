import React, { Component } from 'react';
import "./pollviewer.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

import Header from "../../components/header/header.js"

export default class accountinfo extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
            <Header title = "Poll Viewer" btn = "account" />
              <div className="main-body">
                <MDBRow>
                    <MDBCol xs="12">
                        <div className="question-number">
                            Question 3 of 28:
                        </div>
                    </MDBCol>
                </MDBRow>
                

            </div>
          </header>

        </MDBContainer>
      )
    }
}