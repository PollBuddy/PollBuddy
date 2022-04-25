import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import Question from "../../components/Question/Question";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import "./PollViewer.scss";

class PollViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pollID: props.router.params.pollID,
      showError: null,
      doneLoading: false,
      pollTitle: "",
      pollDescription: "",
      questions: "",
      currentQuestion: 0,
    };
  }

  componentDidMount(){
    this.props.updateTitle("Poll Viewer");
    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID, {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        if (response.result === "success") {
          for (let question of response.data.questions) {
            this.shuffleArray(question.answers);
            let currentAnswers = [...question.selectedAnswers];
            let savedAnswers = localStorage.getItem(question.id);
            if (savedAnswers) {
              currentAnswers = JSON.parse(savedAnswers);
            }
            question.currentAnswers = currentAnswers;
          }
          this.setState({
            pollTitle: response.data.description,
            pollDescription: response.data.description,
            questions: response.data.questions,
            doneLoading: true,
          });
        } else {
          this.setState({
            showError: true,
          });
        }
      });
  }

  displayQuestion = (index) => {
    this.setState({
      currentQuestion: index,
    });
  };

  shuffleArray = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  };

  nextQuestion = () => {
    let newQuestion = this.state.currentQuestion + 1;
    if (newQuestion >= this.state.questions.length) {
      newQuestion = -1;
    }
    this.setState({
      currentQuestion: newQuestion,
    });
  };

  updateQuestion = (newAnswers) => {
    this.state.questions[this.state.currentQuestion].currentAnswers = newAnswers;
    localStorage.setItem(this.state.questions[this.state.currentQuestion].id, JSON.stringify(newAnswers));
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
    } else if (this.state.currentQuestion === -1) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Thanks for submitting! That was the last question.
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <div className="questions-bar">
            {this.state.questions.map((question, index) => {
              return (
                <div className={
                  this.state.currentQuestion === index ?
                    "question-label question-label-active" :
                    "question-label question-label-inactive"
                } onClick={() => this.displayQuestion(index)}>
                  {index + 1}
                </div>
              );
            })}
          </div>
          {this.state.questions.map((question, index) => {
            if (this.state.currentQuestion === index) {
              return (
                <Question nextQuestion={this.nextQuestion} updateQuestion={this.updateQuestion} data={{
                  pollID: this.state.pollID,
                  questionNumber: this.state.currentQuestion + 1,
                  question: this.state.questions[this.state.currentQuestion],
                }}/>
              );
            }
          })}
        </MDBContainer>
      );
    }
  }
}

export default withRouter(PollViewer);
