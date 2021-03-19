import React, {Component} from "react";
import { MDBContainer, MDBDropdownToggle, MDBDropdown, MDBDropdownItem, MDBDropdownMenu } from "mdbreact";
import Question from "../../components/Question/Question";

export default class PollEditor extends Component {
  constructor(props) {
    super(props);
    this.askQuestion = this.askQuestion.bind(this);

    // Add questions to state
    //fetch(process.env.REACT_APP_BACKEND_URL + "/<pollID>/") //this should return the correct information on that specific pollID
    let questions = require("./placeholder");//./placeholder will need to be changed into the json file in the get call or something

    this.state = {
      questions: questions.questions,
      askedQuestions: [],
      questionDispatcherIndex: 0,
    };
  }

  askQuestion() {
    this.setState(prevState => ({
      //...prevState,
      askedQuestions: [
        ...prevState.askedQuestions,
        prevState.questions[prevState.questionDispatcherIndex]
      ]
    }));
  }
  render() {

    return (
      <MDBContainer>
        <MDBContainer className="page">
          <MDBContainer className="box">
            <p>
              Poll Editor {this.props.pollID}
            </p>

            {this.state.askedQuestions.map((value, index) => {
              return (
                <Question questionObj={value} key={index} number={index} />
              );
            })}

            <MDBDropdown>
              <MDBDropdownToggle caret className="button">
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

            <button className="button" onClick={this.askQuestion}>Ask!</button>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
