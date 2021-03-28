import React, {Component} from "react";
import { MDBContainer, MDBDropdownToggle, MDBDropdown, MDBDropdownItem, MDBDropdownMenu } from "mdbreact";
import Question from "../../components/Question/Question";
import autosize from "autosize";
import "./PollEditor.scss";

export default class PollEditor extends Component {
  componentDidMount() {
    autosize(document.querySelector("textarea"));
    this.props.updateTitle("Poll Editor");
  }

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
      pollTitle: "Sample title",
      pollDescription: "This is a sample description",
      pollTitleValue: "",
      pollDescriptionValue: ""
    };

    this.state.pollTitleValue = this.state.pollTitle;
    this.state.pollDescriptionValue = this.state.pollDescription;

    this.handlePollTitleChange = this.handlePollTitleChange.bind(this);
    this.handlePollDescriptionChange = this.handlePollDescriptionChange.bind(this);
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

  toggleTextBox(elementId, selector, text) {
    if(document.getElementById(elementId).style.display === "block") {
      document.getElementById(elementId).style.display = "none";
      document.querySelector(selector).textContent = text;
      if (elementId === "groupText") {
        this.setState({pollTitle: document.getElementById(elementId).value});
      } else {
        this.setState({pollDescription: document.getElementById(elementId).value});
      }
      
    } else {
      document.getElementById(elementId).style.display = "block";
      document.querySelector(selector).textContent = "Submit";
    }
  }

  handlePollTitleChange(event) {
    this.setState({pollTitleValue: event.target.value});
  }

  handlePollDescriptionChange(event) {
    this.setState({pollDescriptionValue: event.target.value});
  }

  render() {

    return (
      <MDBContainer>
        <MDBContainer className="page">
          <MDBContainer className="two-box">
            <MDBContainer className="Poll_Editor_box box">
              <p className="fontSizeLarge">
                Poll Details {this.props.pollID}
              </p>

              <p className="fontSizeSmall">
                {"Poll title: " + this.state.pollTitle}
              </p>

              <p className="fontSizeSmall">
                {"Poll description: " + this.state.pollDescription}
              </p>

              <MDBContainer>
                <input type="GroupName" className="display_none form-control textBox" id="groupText" value={this.state.pollTitleValue} onChange={this.handlePollTitleChange}/>
                <button id="groupBtn" className="button" onClick={() => this.toggleTextBox("groupText","#groupBtn","Change Poll Title")}>Change Poll Title</button>
              </MDBContainer>

              <MDBContainer class="form-group">
                <textarea type="pollDescription" className="display_none form-control textBox" id="descriptionText" maxLength="100" value={this.state.pollDescriptionValue} onChange={this.handlePollDescriptionChange}></textarea>
                <button id="descriptionBtn" className="button" onClick={() => this.toggleTextBox("descriptionText","#descriptionBtn","Change Poll Description")}>Change Poll Description</button>
              </MDBContainer>
            </MDBContainer>

            <MDBContainer className="Poll_Editor_box box">
              <p className="fontSizeLarge">
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
      </MDBContainer>
    );
  }
}
