import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import QuestionResults from "../../components/QuestionResults/QuestionResults";
import "./PollResults.scss";

class PollResults extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      doneLoading: false,
      questions: {},
      currentQuestion: 0,
    };
  }

  async componentDidMount() {
    this.props.updateTitle("Poll Results");
    const httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.props.router.params.pollID + "/results", {
      method: "GET"
    });
    const response = await httpResponse.json();
    if (response.result === "success") {
      this.setState({
        doneLoading: true,
        questions: response.data.questions,
      });
    } else {
      this.setState({
        showError: true,
      });
      this.setState({correctAnswers: this.state.correctAnswers + this.state.questionData.CorrectAnswers[this.state.questionData.CorrectAnswers.length-1]});
      this.setState({"doneLoading": true});
    }
  }

  displayQuestion = (index) => {
    this.setState({
      currentQuestion: index,
    });
  };

  render() {
    if (this.state.showError) {
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
        <MDBContainer fluid className="page">
          <div className="questions-bar">
            {this.state.questions.map((question, index) => {
              return (
                <div>
                  <div className={
                    this.state.currentQuestion === index ?
                      "question-label question-label-active" :
                      "question-label question-label-inactive"
                  } onClick={() => this.displayQuestion(index)}>
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
          {this.state.questions.map((question, index) => {
            if (this.state.currentQuestion === index) {
              return (
                <QuestionResults data={{
                  questionNumber: this.state.currentQuestion + 1,
                  question: this.state.questions[this.state.currentQuestion],
                }}/>
              );
            }
          })}
          <a
            id="downloadBtn" className="button"
            href={process.env.REACT_APP_BACKEND_URL + "/polls/" + this.props.router.params.pollID + "/csv"}
          >
            Download full results CSV
          </a>
        </MDBContainer>
      );
    }
  }
}

export default withRouter(PollResults);
