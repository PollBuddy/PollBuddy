import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import Question from "../../components/Question/Question";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";

export default class PollViewer extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      doneLoading: false,
      questionData: {}
    };
  }

  componentDidMount(){
    this.props.updateTitle("Poll Viewer");

    console.log(this.props.match.params.pollID);

    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.props.match.params.pollID + "/view", {
      method: "GET"
    })
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }

      })
      .then(response => {
        if (response === {}) {
          console.log("Error fetching data");
        } else {
          console.log("Fetching data succeeded");
          console.log(response);
          this.setState({"questionData": response, "doneLoading": true});
        }
      })
      .catch(error => this.setState({"error": error}));
  }

  render() {
    if (this.state.error != null) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Error loading data! Please try again.
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else if (!this.state.doneLoading) {
      return (
        <MDBContainer>
          <LoadingWheel/>
          <button className="btn button" onClick={this.stopLoading}>End Loading</button>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer>
          <MDBContainer className="page">
            <Question questionObj={
              //placeholder json, remove when backend functionality is available
              /*{
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
              }*/
              this.state.questionData
            }/>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
