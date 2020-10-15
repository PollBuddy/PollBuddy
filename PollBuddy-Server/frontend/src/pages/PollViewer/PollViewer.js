import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./PollViewer.scss";
import { MDBContainer } from "mdbreact";

export default class PollViewer extends Component {
  componentDidMount(){
    this.props.updateTitle("Poll Viewer");
  }
  render() {
    return (
      <MDBContainer>
        <MDBContainer className="page">
          <MDBContainer className="box PollViewer-answers">
            <p>
              Question 3 of 28:
            </p>
            <p className="fontSizeLarge">
              Why does the tooth fairy collect teeth?
            </p>
            
            <ul>
              <li id="answerElement0"><a href={"#1"}><span className={"PollViewer-bubble"}>A</span>She grinds them into the fairy dust she needs to fly</a></li>
              <li id="answerElement1"><a href={"#2"}><span className={"PollViewer-bubble"}>B</span>She gives them to new babies who are ready to grow teeth</a></li>
              <li id="answerElement2"><a href={"#3"}><span className={"PollViewer-bubble"}>C</span>She gives the good teeth to dentists to make false teeth</a></li>
              <li id="answerElement3"><a href={"#4"}><span className={"PollViewer-bubble"}>D</span>She grinds them up and makes sand for the beach</a></li>
              <li id="answerElement4"><a href={"#5"}><span className={"PollViewer-bubble"}>E</span>She needs to replace her own teeth</a></li>
            </ul>

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
