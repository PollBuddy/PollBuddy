import React, { Component } from 'react';
import "./pollviewer.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, } from 'mdbreact';

import Header from "../../components/header/header.js"

export default class pollviewer extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
            <Header title = "Poll Viewer" btn = "account" />
              <MDBContainer className="main-body">
                <MDBRow>
                    <MDBCol xs="12">
                        <MDBContainer className="question-number">
                            Question 3 of 28:
                        </MDBContainer>
                        <MDBContainer className="question">
                            Why does the tooth fairy collect teeth?
                        </MDBContainer>

                        <ul className="answers">
                            <li id="answerElement0"><a href={"#1"}><span className={"answerNumber"}>A</span><span className={"answerText"}> She grinds them into the fairy dust she needs to fly</span></a></li>
                            <li id="answerElement1"><a href={"#2"}><span className={"answerNumber"}>B</span><span className={"answerText"}> She gives them to new babies who are ready to grow teeth</span></a></li>
                            <li id="answerElement2"><a href={"#3"}><span className={"answerNumber"}>C</span><span className={"answerText"}> She gives the good teeth to dentists to make false teeth</span></a></li>
                            <li id="answerElement3"><a href={"#4"}><span className={"answerNumber"}>D</span><span className={"answerText"}> She grinds them up and makes sand for the beach</span></a></li>
                        </ul>
                    </MDBCol>
                </MDBRow>
                

            </MDBContainer>
          </header>

        </MDBContainer>
      )
    }
}