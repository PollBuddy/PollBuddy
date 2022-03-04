import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import Question from "../../components/Question/Question";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class PollViewer extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      doneLoading: false,
      questionData: {},
      perPoll: false
    };
  }

  componentDidMount(){
    this.props.updateTitle("Poll Viewer");

    let pollID = this.props.router.params.pollID;

    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + pollID + "/view", {
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
          this.setState({"questionData": response.data, "doneLoading": true});
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
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <Question perPoll ={this.state.perPoll} questionObj={
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
      );
    }
  }
}

export default withRouter(PollViewer);