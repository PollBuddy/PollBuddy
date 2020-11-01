import React, { Component } from "react";
import "./Question.scss";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBContainer, MDBBtn, MDBRow,
  MDBIcon
} from "mdbreact";

import Countdown, { zeroPad } from "react-countdown";


export default class Question extends Component {
  constructor(props) {
    super(props);
    //binding helper functions
    this.deselectChoice = this.deselectChoice.bind(this);
    this.selectChoice = this.selectChoice.bind(this);
    //get props
    let data = props.questionObj;

    //set up an array of booleans (representing the student's answer choices)
    //and initialize it to all false
    let tempArray = [];
    for (let i = 0; i < data.choices.length; i++) {
      tempArray.push(false);
    }
    //add the data and the array to state
    this.state = {
      key: props.questionNumber,
      data: data,
      studentChoices: tempArray,
    };
  }

  deselectChoice(index) {
    //set the boolean in the array at the selected index to false
    //and update state
    let tempChoices = this.state.studentChoices;
    tempChoices[index] = false;
    this.setState(prevState => ({
      ...prevState,
      studentChoices: tempChoices,
    }
    )
    );
  }

  selectChoice(index) {
    let tempChoices = this.state.studentChoices;
    let count = 0;
    //count the number of booleans that are true in the array
    for (let i = 0; i < this.state.studentChoices.length; i++) {
      if (this.state.studentChoices[i]) {
        count++;
      }
    }
    //if the number of true booleans is greater than the maximum number of
    //allowed choices (specified by the json) then set the entire array
    //back to false
    if (count >= this.state.data.maxAllowedChoices) {
      for (let i = 0; i < this.state.studentChoices.length; i++) {
        if (this.state.studentChoices[i]) {
          tempChoices[i] = false;
        }
      }
    }
    //make the boolean at the selected index true and update state
    tempChoices[index] = true;
    this.setState(prevState => ({
      ...prevState,
      studentChoices: tempChoices,
    }));
  }

  

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
    return (
      <MDBContainer id={"question-box"} className="box">
        <p>Question {this.state.data.questionNumber}</p>
        <span className={"question-title"}>{this.state.data.question}</span>
        { // only display image if there is one
          this.state.data.img &&
          <img
            className="question_img-fluid"
            src={this.state.data.img}
            alt={""}/>
        }
                <MDBContainer className={"question-btn-container"}>
                  {this.state.data.choices.map((choice, index) => {

                    if (this.state.studentChoices[index]) {
                      return (
                        <btn className={"question-btn-and-text"} onClick={() => {
                          return this.deselectChoice(index);
                        }}>
                              <MDBContainer className="question-btn question-btn-active question-btn-apply-hover-effect">
                                {choice}
                              </MDBContainer>
                          {this.state.data.choicesText[index]}
                        </btn>
                      );
                    } else {
                      return (
                        <btn className={"question-btn-and-text"} onClick={() => {
                          return this.selectChoice(index);
                        }}>
                              <MDBContainer className="question-btn question-btn-inactive question-btn-apply-hover-effect">
                                {choice}
                              </MDBContainer>
                          {this.state.data.choicesText[index]}
                        </btn>
                      );
                    }
                  })}
                </MDBContainer>
              <div className='rounded-bottom mdb-color lighten-3 text-center pt-3'>
                <ul className='list-unstyled list-inline font-small'>
                  <li className='list-inline-item white-text'>
                    <MDBIcon far icon="star" /> 12
                  </li>
                  <li className='list-inline-item'>
                    <a href='#!' className='white-text'>
                      <MDBIcon far icon="clock" />
                      <Countdown
                        renderer={clockFormat}
                        date={Date.now() + this.state.data.timeLimit * 1000}
                      />
                    </a>
                  </li>
                </ul>
              </div>
      </MDBContainer>
    );
  }
}
