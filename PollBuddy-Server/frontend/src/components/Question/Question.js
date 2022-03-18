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
    //binding helper functions
    this.deselectChoice = this.deselectChoice.bind(this);
    this.selectChoice = this.selectChoice.bind(this);
    this.getChoiceLabel = this.getChoiceLabel.bind(this);
    this.onTimeEnd = this.onTimeEnd.bind(this);
    this.submitAnswers = this.submitAnswers.bind(this);

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

    //get props
    let data = props.questionObj;

    // Store ID for answer submission
    let id = data.PollID;

    // TODO: Update so that this can handle multiple questions, or do it in PollViewer.js
    // Manual override is below
    console.log("data");
    console.log(data);
    data = data.Questions[0];

    //set up an array of booleans (representing the student's answer choices)
    //and initialize it to all false
    let tempArray = [];
    for (let i = 0; i < data.AnswerChoices.length; i++) {
      tempArray.push(false);
    }
    let tempQueue = [];
    //add the data and the array to state
    this.state = {
      data: data,
      studentChoices: tempArray,
      choicesQueue: tempQueue,
      canChoose: true,
      PollID: id,
      timeLeft: true
    };
  }

  deselectChoice(index) {
    if(!this.state.canChoose){
      return;
    }
    //set the boolean in the array at the selected index to false
    //remove it from the queue and update state
    let tempChoices = this.state.studentChoices;
    tempChoices[index] = false;
    //remove the index from teh queue
    for(let i = 0; i < this.state.choicesQueue.length; i++){
      if(this.state.choicesQueue[i] === index){
        this.state.choicesQueue.splice(i, 1);
        break;
      }
    }
    this.setState(prevState => ({
      ...prevState,
      studentChoices: tempChoices,
      // choicesQueue: tempQueue,
    }
    )
    );
  }

  selectChoice(index) {
    if(!this.state.canChoose){
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
      this.state.studentChoices[this.state.choicesQueue.shift()] = false;
    }
    //make the boolean at the selected index true and update state
    tempChoices[index] = true;
    this.setState(prevState => ({
      ...prevState,
      studentChoices: tempChoices,
    }));
  }

  //return the correct label to go in the choice bubble based on the index of the choice
  getChoiceLabel(index){
    //if the index is between 0 and 25, simply return the proper letter
    if(index < this.choiceOrder.length){
      return this.choiceOrder[index];
    }
    //if the index is greater than 25, return a combination of letters (ex. AA, BB, etc)
    let repititions = Math.floor(index / 26) + 1;
    let charIndex = index % 26;
    let str = "";
    for(let i = 0; i < repititions; i++){
      str += this.choiceOrder[charIndex];
    }
    return str;
  }

  onTimeEnd(){
    this.state.canChoose = false;
    //TODO send answers to backend
    //TODO move on to next question (probably should be handled in a callback prop)
  }

  submitAnswers = () => {
    // Build submission
    // TODO: This will need to be formatted better in the future but it's fine for the demo
    let submission = { "Answers": [ { "QuestionNumber": 1} ]};
    console.log(this.state.studentChoices);
    console.log(this.state.choicesQueue);
    submission.Answers[0].Answer = this.state.data.AnswerChoices[this.state.choicesQueue[0]];
    console.log(submission);

    // Submit
    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.PollID + "/submit", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(submission)
    })
      .then(response => response.text())
      .then(response => {
        console.log("Server response to submission: " + response);
        this.setState({successfulSubmission: true});
      });
  };
  
  render() {
    console.log(this.state.choicesQueue);
    const clockFormatDays = ({ days, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(days)}</span>;
      }
    };
    const clockFormatHours = ({ hours, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(hours)}</span>;
      }
    };
    const clockFormatMinutes = ({ minutes, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(minutes)}</span>;
      }
    };
    const clockFormatSeconds = ({ seconds, completed }) => {

      if (completed) {
        // Render a completed state
        this.setState({timeLeft: false});
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(seconds)}</span>;
      }
    };

    if(this.state.successfulSubmission) {
      return (
        <Navigate to={"/polls/" + this.state.PollID + "/results"} push={true} />
      );
    }

    return (
      <MDBContainer className="box">
        <p className="question-num">Question {this.state.data.QuestionNumber}</p>
        <MDBIcon far icon="clock" className="time-icon"/>
        <span className={"question-title"}>{this.state.data.QuestionText}</span>
        { // only display image if there is one
          this.state.data.img &&
          <img
            className="question-img-fluid"
            src={this.state.data.img}
            alt={""}/>
        }
        <MDBContainer style={{ width: "100%"}}>
          {this.state.data.AnswerChoices.map((choice, index) => {

            if (this.state.studentChoices[index]) {
              return (
                <btn className={"question-btn-and-text"} onClick={() => {
                  return this.deselectChoice(index);
                }}>
                  <MDBContainer className="question-label-bubble question-label-bubble-active">
                    {this.getChoiceLabel(index)}
                  </MDBContainer>
                  {choice}
                </btn>
              );
            } else {
              return (
                <btn className={"question-btn-and-text"} onClick={() => {
                  return this.selectChoice(index);
                }}>
                  <MDBContainer className="question-label-bubble question-label-bubble-inactive">
                    {this.getChoiceLabel(index)}
                  </MDBContainer>
                  {choice}
                </btn>
              );
            }
          })}
        </MDBContainer>
        { (this.state.timeLeft) ?(
            <MDBContainer>
              <MDBContainer className = "button time-info-label">
                <span>Question Time Remaining</span>
              </MDBContainer>
              <MDBContainer className="time-grid" title = "Question Countdown">
                <button className = "button time-info">
                  <Countdown
                      renderer={clockFormatDays}
                      date={ this.state.data.CloseTime }//stored in milliseconds
                      onComplete={this.onTimeEnd}
                  />
                </button>
                <button className = "button time-info">
                <Countdown
                renderer={clockFormatHours}
                date={ this.state.data.CloseTime }//stored in milliseconds
                onComplete={this.onTimeEnd}
                />
                </button>
                <button className = "button time-info">
                <Countdown
                renderer={clockFormatMinutes}
                date={ this.state.data.CloseTime }//stored in milliseconds
                onComplete={this.onTimeEnd}
                />
                </button>
                <button className = "button time-info">
                <Countdown
                renderer={clockFormatSeconds}
                date={ this.state.data.CloseTime }//stored in milliseconds
                onComplete={this.onTimeEnd}
                />
                </button>
                <button className={"time-info-text"}>
                <span>Days</span>
                </button>
                <button className={"time-info-text"}>
                <span>Hrs</span>
                </button>
                <button className={"time-info-text"}>
                <span>Mins</span>
                </button>
                <button className={"time-info-text"}>
                <span>Secs</span>
                </button>
              </MDBContainer>
            </MDBContainer>
        ) : (
              <button className="button time-info-closed" title = "Question Countdown">Question Closed!</button>
          )
        }
        <MDBContainer>
          {(this.state.timeLeft) &&
           <button className="button" onClick={this.submitAnswers}>Submit</button>}
        </MDBContainer>
      </MDBContainer>
    );
  }
}
