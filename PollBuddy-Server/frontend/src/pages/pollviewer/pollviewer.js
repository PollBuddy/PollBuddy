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
                        <div className="question">
                            Why does the tooth fairy collect teeth?
                        </div>

                        <ul className="answers">
                            <li>She grinds them into the fairy dust she needs to fly</li>
                            <li>She  gives them to new babies who are ready to grow teeth</li>
                            <li>She gives the good teeth to dentists to make false teeth</li>
                            <li>She grinds them up and makes sand for the beach</li>
                        </ul>
                    </MDBCol>
                </MDBRow>
                

            </div>
          </header>

        </MDBContainer>
      )
    }
}