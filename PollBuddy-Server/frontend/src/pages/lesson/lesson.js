import React, {Component} from 'react';
import './lesson.scss'

import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'

import Question from './components/question'



export default class lesson extends Component {
  
  constructor(props) {
    super(props);

    // Add questions to state
    let questions = require('./placeholder');

    this.state = {
      questions: questions.questions
    }
  }
  
  render() {
    
    
    return (
      <MDBContainer>
        <div className="page-lesson">
          Hello lesson {this.props.lessonId}
        </div>
        <MDBContainer>
          {this.state.questions.map((value, index) => {
            return (
                <Question questionObj={value} key={index}>
                  
                </Question>
            )
          })}
        </MDBContainer>
      </MDBContainer>
    )
  }
}