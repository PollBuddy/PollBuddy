import React, {Component} from 'react';
import './lesson.scss'

import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
export default class lesson extends Component {

  
  render() {
    const questions = [1,2,3,4,5];
    function addq() {
      questions.concat(1);
    }
    
    return (
      <MDBContainer>
        <div className="page-lesson">
          Hello lesson {this.props.lessonId}
        </div>
        <MDBContainer>
          {questions.map((value, index) => {
            return (
            <MDBRow key={index}>
              <MDBCol>{value}</MDBCol>
            </MDBRow>)
          })}
        </MDBContainer>
      </MDBContainer>
    )
  }
}