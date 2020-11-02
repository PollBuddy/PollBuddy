import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./PollViewer.scss";
import { MDBContainer } from "mdbreact";
import Question from "../../components/Question/Question";

export default class PollViewer extends Component {
  componentDidMount(){
    this.props.updateTitle("Poll Viewer");
  }
  render() {
    return (
      <MDBContainer>
        <MDBContainer className="page">
          <Question questionObj={//placeholder json, remove when backend functionality is available
            {
              "questionNumber": "3",
              "question": "Why does the tooth fairy collect teeth?",
              // "img": "https://i.kym-cdn.com/photos/images/newsfeed/001/409/553/5f5.png",
              "choices": [
                "She grinds them into the fairy dust she needs to fly",
                "She gives them to new babies who are ready to grow teeth",
                "She gives the good teeth to dentists to make false teeth",
                "She grinds them up and makes sand for the beach",
                "She needs to replace her own teeth",
              ],
              "points": 2,
              "maxAllowedChoices": 2,
              "timeLimit": 10
            }
          }/>
          {/*<MDBContainer className="box pollview_answers">*/}
          {/*  <p>*/}
          {/*    Question 3 of 28:*/}
          {/*  </p>*/}
          {/*  <p className="fontSizeLarge">*/}
          {/*    Why does the tooth fairy collect teeth?*/}
          {/*  </p>*/}
          {/*  */}
          {/*  <ul>*/}
          {/*    <li id="answerElement0"><a href={"#1"}><span className={"pollviewer_bubble"}>A</span>She grinds them into the fairy dust she needs to fly</a></li>*/}
          {/*    <li id="answerElement1"><a href={"#2"}><span className={"pollviewer_bubble"}>B</span>She gives them to new babies who are ready to grow teeth</a></li>*/}
          {/*    <li id="answerElement2"><a href={"#3"}><span className={"pollviewer_bubble"}>C</span>She gives the good teeth to dentists to make false teeth</a></li>*/}
          {/*    <li id="answerElement3"><a href={"#4"}><span className={"pollviewer_bubble"}>D</span>She grinds them up and makes sand for the beach</a></li>*/}
          {/*    <li id="answerElement4"><a href={"#5"}><span className={"pollviewer_bubble"}>E</span>She needs to replace her own teeth</a></li>*/}
          {/*  </ul>*/}

          {/*</MDBContainer>*/}
        </MDBContainer>
      </MDBContainer>
    );
  }
}
