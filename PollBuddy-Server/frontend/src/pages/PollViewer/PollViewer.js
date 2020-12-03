import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
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
        </MDBContainer>
      </MDBContainer>
    );
  }
}
