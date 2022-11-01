import React, {Component} from "react";
import "./Question.scss";
import {
  MDBContainer,
  MDBIcon
} from "mdbreact";

import {Navigate} from "react-router-dom";
import Timer from "../Timer/Timer.js";

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
    let closeTime = new Date();
    closeTime.setHours(closeTime.getHours() + 2);
    let question = props.data.question;
    this.state = {
      pollID: props.data.pollID,
      questionNumber: props.data.questionNumber,
      question: question,
      currentAnswers: question.currentAnswers || [],
      perPoll: true,
      timeLeft: true,
      closeTime: closeTime,
      pollCloseTime: props.data.pollCloseTime,
    };
  }

  onTimeEnd() {
    this.state.canChoose = false;
  }

  selectChoice(index) {
    if (!this.state.canChoose) {
      return;
    }
    let tempChoices = this.state.studentChoices;
    let count = 0;
    //push the index to the queue
    this.state.choicesQueue.push(index);
    //count the number of booleans that are true in the array
    for (let i = 0; i < this.state.studentChoices.length; i++) {
      if (this.state.studentChoices[i]) {
        count++;
      }
    }
    //if the number of true booleans is greater than the maximum number of
    //allowed choices (specified by the json) then pop from the queue to set the first
    //choice chosen back to false
    if (count >= this.state.data.MaxAllowedChoices) {
      tempChoices[this.state.choicesQueue.shift()] = false;
    }
    //make the boolean at the selected index true and update state
    tempChoices[index] = true;
    this.setState(prevState => ({
      ...prevState,
      studentChoices: tempChoices,
    }));
  }

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
    let httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID + "/submitQuestion/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.getSubmitData())
    });
    let response = httpResponse.json();
    this.props.nextQuestion();
  };

  noTimeLeft = () => {
    this.setState({timeLeft: false});
  };

  render() {
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
              <div className={"question-btn-and-text"} key={index} onClick={() => {
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
              </div>
            );
          })}
        </MDBContainer>
        { /* This should work, but is being commented out for now since per-question times are not implemented fully yet
        <MDBContainer className = "button time-info-label">
          <span>Question Time Remaining</span>
        </MDBContainer>
        <Timer timeLeft={this.state.timeLeft} noTimeLeft = {() => this.noTimeLeft()}
          CloseTime={this.state.closeTime} onTimeEnd={this.onTimeEnd} />
          */}
        <MDBContainer>
          {(this.state.timeLeft) &&
            <button className="button" onClick={this.submitQuestion}>Save</button>}
        </MDBContainer>
      </MDBContainer>
    );
  }
}
