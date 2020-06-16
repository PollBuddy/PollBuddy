import React, {Component} from "react";
import "./lesson.scss"

import { MDBContainer, MDBRow, MDBCol, MDBDropdownToggle, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBBtn } from "mdbreact"

import Question from "../../components/question"



export default class lesson extends Component {
  
  constructor(props) {
    super(props);
    this.askQuestion = this.askQuestion.bind(this);

    // Add questions to state
    //fetch(http://localhost:3001/<pollID>/) //this should return the correct information on that specific pollID
    let questions = require("./placeholder");//./placeholder will need to be changed into the json file in the get call or something

    this.state = {
      questions: questions.questions,
      askedQuestions: [],
      questionDispatcherIndex: 0,
    }
  }

  askQuestion() {
    this.setState(prevState => ({
      //...prevState,
      askedQuestions: [
        ...prevState.askedQuestions,
        prevState.questions[prevState.questionDispatcherIndex]
      ]
    }))
  }
  
  render() {
    
    
    return (
      <MDBContainer>
        <div className="page-lesson">
          Hello lesson {this.props.lessonId}
        </div>
        <MDBContainer>
          {this.state.askedQuestions.map((value, index) => {
            return (
              <Question questionObj={value} key={index} number={index} />
            )
          })}
          <MDBRow>
            <MDBCol size="4">
              <MDBDropdown>
                <MDBDropdownToggle caret color="primary">
                  {this.state.questions[this.state.questionDispatcherIndex].title}
                </MDBDropdownToggle>
                <MDBDropdownMenu basic>
                  {this.state.questions.map((value, index) => {
                    let tag;
                    if(index === this.state.questionDispatcherIndex) {
                      tag = <MDBDropdownItem key={index} active href="#">
                        {index+1}: {value.title}
                      </MDBDropdownItem>;
                    } else {
                      tag = <MDBDropdownItem 
                        onClick={() => {
                          this.setState({questionDispatcherIndex: index});
                        } } 
                        key={index} 
                        href="#">
                        {index+1}: {value.title}
                      </MDBDropdownItem>;
                    }
                    return tag;
                  })}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
            <MDBCol size="4">
              <MDBBtn onClick={this.askQuestion}>Ask!</MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBContainer>
    )
  }
}