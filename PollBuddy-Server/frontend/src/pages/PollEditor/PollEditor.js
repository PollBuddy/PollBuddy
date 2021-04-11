import React, {Component} from "react";
import { MDBContainer, MDBDropdownToggle, MDBDropdown, MDBDropdownItem, MDBDropdownMenu } from "mdbreact";
import Question from "../../components/Question/Question";
import {Link} from "react-router-dom";
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
      pollDescriptionValue: "",
      displayQuestionEditor: false,
      currentQuestion: "",
      pollQuestionTitleValue: "",
      pollQuestionValue: ""
    };

    this.state.pollTitleValue = this.state.pollTitle;
    this.state.pollDescriptionValue = this.state.pollDescription;

    this.handlePollTitleChange = this.handlePollTitleChange.bind(this);
    this.handlePollDescriptionChange = this.handlePollDescriptionChange.bind(this);
    this.handlePollQuestionTitleChange = this.handlePollQuestionTitleChange.bind(this);
    this.handlePollQuestionChange = this.handlePollQuestionChange.bind(this);
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

  handlePollQuestionTitleChange(event) {
    this.setState({pollQuestionTitleValue: event.target.value});
  }

  handlePollQuestionChange(event) {
    this.setState({pollQuestionValue: event.target.value});
  }

  createNewQuestion() {
    console.log(this.state.questions);
    console.log("Create new question");
    if (document.getElementById("newQuestionBtn").textContent === "Submit") {
      let newQuestion = {
        title: document.getElementById("question_title_input").value,
        question: document.getElementById("question_input").value
      };
      this.setState({questions: [...this.state.questions, newQuestion]});
      document.getElementById("question_title_input").style.display = "none";
      document.getElementById("question_input").style.display = "none";
      document.getElementById("newQuestionBtn").textContent = "New Question";
    } else {
      document.getElementById("question_title_input").style.display = "block";
      document.getElementById("question_input").style.display = "block";
      document.getElementById("newQuestionBtn").textContent = "Submit";
    }
  }

  editQuestion(question) {
    document.getElementById("poll_questions").style.display = "none";
    this.setState({displayQuestionEditor: true});
    this.setState({currentQuestion: question});
    console.log("Current question: " + question.title);
    this.setState({pollQuestionTitleValue: question.title});
    this.setState({pollQuestionValue: question.question})
  }

  submitEditQuestion() {
    console.log("submitted edit question")
    this.setState({displayQuestionEditor: false});
    document.getElementById("poll_questions").style.display = "flex";
    var found = this.state.questions.find(element => element.title === this.state.currentQuestion.title)
    console.log("found: " + found.title)
    found.title = document.getElementById("edit_question_title_input").value;
    found.question = document.getElementById("edit_question_input").value;
    console.log("new questions")
    console.log(this.state.questions)
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

              <div id="poll_questions" className="Poll_Editor_center">
                {this.state.questions.length === 0 ? (
                  <p>Sorry, you don't have any polls.<br/> <br/></p>
                ) : (
                  <React.Fragment>
                    {console.log(this.state.questions)}
                    {this.state.questions.map((value, index) => (
                      <button style={{  width: "17em" }} className="button" onClick={() => this.editQuestion(value)}>{"Question " + (index+1) + ": " + value.title}</button>
                    ))}
                  </React.Fragment>
                )}

                <MDBContainer class="form-group">
                  <input className="display_none form-control textBox" id="question_title_input" placeholder="Title"></input>
                  <input className="display_none form-control textBox" id="question_input" placeholder="Question"></input>
                  <button type="submit" id="newQuestionBtn" className="button" onClick={() => this.createNewQuestion()}>New Question</button>
                </MDBContainer>
              </div>

              {this.state.displayQuestionEditor &&
                <MDBContainer class="form-group">
                  <input className="form-control textBox" id="edit_question_title_input" placeholder="Edit Title" value={this.state.pollQuestionTitleValue} onChange={this.handlePollQuestionTitleChange}></input>
                  <input className="form-control textBox" id="edit_question_input" placeholder="Edit Question" value={this.state.pollQuestionValue} onChange={this.handlePollQuestionChange}></input>
                  <button type="submit" id="editQuestionBtn" className="button" onClick={() => this.submitEditQuestion()}>Submit</button>
                </MDBContainer>
              }

              {/* {this.state.askedQuestions.map((value, index) => {
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
              </MDBDropdown> */}

              {/* <button className="button" onClick={this.askQuestion}>Ask!</button> */}
            </MDBContainer>
          </MDBContainer>
          
        </MDBContainer>
      </MDBContainer>
    );
  }
}
