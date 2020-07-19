import React, { Component } from "react";
import "./question.scss"
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

import Countdown, { zeroPad } from "react-countdown-now";


export default class question extends Component {
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
      key: props.number,
      data: data,
      studentChoices: tempArray,
    }
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
    )
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
    }))
  }

  

  render() {
    const clockFormat = ({ minutes, seconds, completed }) => {
        
      if (completed) {
        // Render a completed state
        return <span>Question closed!</span>
      } else {
        // Render a countdown
        return <span>{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
      }
    };
    return (
      <MDBContainer className="question_component-question">
        <MDBRow>
          <MDBCol md="8">
            <MDBCard >
              { // only display image if there is one
                this.state.data.img &&
                <MDBCardImage
                  className="question_img-fluid"
                  src={this.state.data.img}
                  waves
                />
              }
              
              <MDBCardBody>
                
                <MDBCardTitle>Q{this.state.key+1}: {this.state.data.title} </MDBCardTitle>
                
                <MDBCardText>
                  {this.state.data.question}
                </MDBCardText>
                <hr />
                <MDBContainer>
                  {this.state.data.choices.map((choice, index) => {

                    if (this.state.studentChoices[index]) {
                      return (
                        <MDBContainer key={index}>
                          <MDBRow>
                            <MDBCol small="2">
                              <MDBBtn className="question_btn-choice" onClick={() => {
                                return this.deselectChoice(index) 
                              }}>
                                {choice}
                              </MDBBtn>
                            </MDBCol>
                            <MDBCol small="10">
                              {this.state.data.choicesText[index]}
                            </MDBCol>
                          </MDBRow>
                        </MDBContainer>
                      )
                    } else {
                      return (
                        <MDBContainer key={index}>
                          <MDBRow>
                            <MDBCol small="2">
                              <MDBBtn className="question_btn-choice" outline onClick={() => {
                                return this.selectChoice(index) 
                              }}>
                                {choice}
                              </MDBBtn>
                            </MDBCol>
                            <MDBCol small="10">
                              {this.state.data.choicesText[index]}
                            </MDBCol>
                          </MDBRow>
                        </MDBContainer>
                      )
                    }
                  })}
                </MDBContainer>
              </MDBCardBody>
              <div className='rounded-bottom mdb-color lighten-3 text-center pt-3'>
                <ul className='list-unstyled list-inline font-small'>
                  <li className='list-inline-item white-text'>
                    <MDBIcon far icon="star" /> 12
                  </li>
                  <li className='list-inline-item'>
                    <a href='#!' className='white-text'>
                      <MDBIcon far icon="clock" /> <Countdown renderer={clockFormat} date={Date.now() + this.state.data.timeLimit*1000} />
                    </a>
                  </li>
                </ul>
              </div>
            </MDBCard>
          </MDBCol>

        </MDBRow>


      </MDBContainer>
    )
  }
}