import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./pollviewer.scss";
import { MDBContainer } from "mdbreact";

export default class pollviewer extends Component {
  componentDidMount(){
    this.props.updateTitle("Poll Viewer");
  }
  render() {
    return (
      <MDBContainer>
        <MDBContainer className="page">
          <MDBContainer className="box pollview_answers">
            <p>
              Question 3 of 28:
            </p>
            <p className="fontSizeLarge">
              <b>Why does the tooth fairy collect teeth?</b>
            </p>

            <ul>
              <li id="answerElement0"><a href={"#1"}><span className={"pollviewer_bubble"}>A</span>She grinds them into the fairy dust she needs to fly</a></li>
              <li id="answerElement1"><a href={"#2"}><span className={"pollviewer_bubble"}>B</span>She gives them to new babies who are ready to grow teeth</a></li>
              <li id="answerElement2"><a href={"#3"}><span className={"pollviewer_bubble"}>C</span>She gives the good teeth to dentists to make false teeth</a></li>
              <li id="answerElement3"><a href={"#4"}><span className={"pollviewer_bubble"}>D</span>She grinds them up and makes sand for the beach</a></li>
              <li id="answerElement4"><a href={"#5"}><span className={"pollviewer_bubble"}>E</span>She needs to replace her own teeth</a></li>
            </ul>

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
