import React, { Component } from "react";
import "./Question.scss";
import {
  MDBContainer,
  MDBIcon
} from "mdbreact";

import Countdown, { zeroPad } from "react-countdown";
import {Navigate} from "react-router-dom";

export default class Question extends Component {
  choiceOrder;
  questionStartTime;
  constructor(props) {
    super(props);

    this.choiceOrder = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    this.questionStartTime = Date.now();
    let question = props.data.question;
    this.state = {
      pollID: props.data.pollID,
      questionNumber: props.data.questionNumber,
      question: question,
      currentAnswers: question.currentAnswers || [],
    };
  }

  // onTimeEnd(){
  //   this.state.canChoose = false;
  //   //TODO send answers to backend
  //   //TODO move on to next question (probably should be handled in a callback prop)
  // }

  isAnswerSelected = (answerID) => {
    let i = this.state.currentAnswers.indexOf(answerID);
    return i >= 0;
  };

  selectAnswer = (answerID) => {
    let currentAnswers = [...this.state.currentAnswers];
    let i = currentAnswers.indexOf(answerID);
    if (i >= 0) {
      currentAnswers.splice(i, 1);
    } else {
      currentAnswers.push(answerID);
      if (currentAnswers.length > this.state.question.maxAllowedChoices) {
        currentAnswers.shift();
      }
    }
    this.props.updateQuestion(currentAnswers);
    this.setState({
      currentAnswers: currentAnswers,
    });
  };

  getSubmitData = () => {
    return {
      id: this.state.question.id,
      answers: this.state.currentAnswers,
    };
  };

  submitQuestion = async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID + "/submitQuestion/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.getSubmitData())
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      });
    this.props.nextQuestion();
  };

  render() {
    const clockFormat = ({ minutes, seconds, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>Question closed!</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
      }
    };

    // if(this.state.successfulSubmission) {
    //   return (
    //     <Navigate to={"/polls/" + this.state.PollID + "/results"} push={true} />
    //   );
    // }
    console.log("Heu");
    return (
      <MDBContainer className="box">
        <p className="fontSizeLarge">Question {this.state.questionNumber}: {this.state.question.text}</p>
        { // only display image if there is one
          this.state.question.img &&
          <img
            className="question-img-fluid"
            src={this.state.data.img}
            alt={""}/>
        }
        <MDBContainer>
          {this.state.question.answers.map((answer, index) => {
            return (
              <btn className={"question-btn-and-text"} onClick={() => {
                this.selectAnswer(answer.id);
              }}>
                <MDBContainer
                  // className="question-label-bubble"
                  className={
                    this.isAnswerSelected(answer.id) ?
                      "question-label-bubble question-label-bubble-active" :
                      "question-label-bubble question-label-bubble-inactive"
                  }
                >
                  {this.choiceOrder[index]}
                </MDBContainer>
                {answer.text}
              </btn>
            );
            // if (this.state.studentChoices[index]) {
            //   return (
            //     <btn className={"question-btn-and-text"} onClick={() => {
            //       return this.deselectChoice(index);
            //     }}>
            //       <MDBContainer className="question-label-bubble question-label-bubble-active">
            //         {this.getChoiceLabel(index)}
            //       </MDBContainer>
            //       {choice}
            //     </btn>
            //   );
            // } else {
            //   return (
            //     <btn className={"question-btn-and-text"} onClick={() => {
            //       return this.selectChoice(index);
            //     }}>
            //       <MDBContainer className="question-label-bubble question-label-bubble-inactive">
            //         {this.getChoiceLabel(index)}
            //       </MDBContainer>
            //       {choice}
            //     </btn>
            //   );
            // }
          })}
        </MDBContainer>
        {/*<MDBContainer className="button time-info">*/}
        {/*  <MDBIcon far icon="clock" className="time-icon"/>*/}
        {/*  <Countdown*/}
        {/*    renderer={clockFormat}*/}
        {/*    date={this.questionStartTime + this.state.data.TimeLimit * 1000}*/}
        {/*    onComplete={this.onTimeEnd}*/}
        {/*  />*/}
        {/*</MDBContainer>*/}
        <MDBContainer>
          <button
            className="button"
            onClick={this.submitQuestion}
          >
            Save
          </button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
