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

    // let questions = require("./placeholder");//./placeholder will need to be changed into the json file in the get call or something

    this.state = {
      questions: [],
      askedQuestions: [],
      questionDispatcherIndex: 0,
      pollTitle: "Sample title",
      pollDescription: "This is a sample description",
      pollTitleValue: "",
      pollDescriptionValue: "",
      displayQuestionEditor: false,
      currentQuestion: "",
      pollQuestionTitleValue: "",
      pollQuestionValue: "",
      reorderQuestions: false
    };

    this.getPoll();

    // this.state.pollTitleValue = this.state.pollTitle;
    this.state.pollDescriptionValue = this.state.pollDescription;

    this.handlePollTitleChange = this.handlePollTitleChange.bind(this);
    this.handlePollDescriptionChange = this.handlePollDescriptionChange.bind(this);
    this.handlePollQuestionTitleChange = this.handlePollQuestionTitleChange.bind(this);
    this.handlePollQuestionChange = this.handlePollQuestionChange.bind(this);
  }

  getPoll() {
    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/").then(response => response.json()).then(data => {
      console.log(data);
      console.log(data[0].Questions);
      this.setState({pollTitle: data[0].Name});
      this.setState({pollTitleValue: data[0].Name});
      this.setState({questions: data[0].Questions});
    }); //this should return the correct information on that specific pollID
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

  savePollTitle() {
    this.setState({pollTitle: document.getElementById("pollTitle").value});
  }

  savePollDescription() {
    this.setState({pollDescription: document.getElementById("pollDescription").value});
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
    if (document.getElementById("newQuestionBtn").textContent === "Submit") {
      let newQuestion = [{
        QuestionText: document.getElementById("question_input").value
      }];
      this.setState({questions: [...this.state.questions, newQuestion]});
      document.getElementById("question_title_input").style.display = "none";
      document.getElementById("question_input").style.display = "none";
      document.getElementById("newQuestionBtn").textContent = "New Question";
      document.getElementById("newQuestionCancelButton").style.display = "none";
    } else {
      document.getElementById("question_title_input").style.display = "block";
      document.getElementById("question_input").style.display = "block";
      document.getElementById("newQuestionBtn").textContent = "Submit";
      document.getElementById("newQuestionCancelButton").style.display = "inline";
    }
  }

  cancelNewQuestion() {
    document.getElementById("question_title_input").style.display = "none";
    document.getElementById("question_input").style.display = "none";
    document.getElementById("newQuestionBtn").textContent = "New Question";
    document.getElementById("newQuestionCancelButton").style.display = "none";
  }

  editQuestion(question) {
    document.getElementById("poll_questions").style.display = "none";
    this.setState({displayQuestionEditor: true});
    this.setState({currentQuestion: question});
    this.setState({pollQuestionTitleValue: question.QuestionText});
    this.setState({pollQuestionValue: question.QuestionText});
  }

  submitEditQuestion() {
    this.setState({displayQuestionEditor: false});
    document.getElementById("poll_questions").style.display = "flex";
    var found = this.state.questions.find(element => element[0].QuestionText === this.state.currentQuestion.QuestionText);
    found[0].QuestionText = document.getElementById("edit_question_title_input").value;
    found[0].QuestionText = document.getElementById("edit_question_input").value;
  }

  reorderQuestions() {
    this.setState({reorderQuestions: !this.state.reorderQuestions});
  }

  moveQuestionUp(index) {
    var reorderedQuestions = this.move(index, index-1);
    this.setState({questions: reorderedQuestions});
  }

  moveQuestionDown(index) {
    var reorderedQuestions = this.move(index, index+1);
    this.setState({questions: reorderedQuestions});
  }

  move(old_index, new_index) {
    if (old_index > new_index && old_index == 0) {
      new_index = this.state.questions.length - 1;
    }
    if (old_index < new_index && old_index == this.state.questions.length - 1) {
      new_index = 0;
    }
    this.state.questions.splice(new_index, 0, this.state.questions.splice(old_index, 1)[0]);
    return this.state.questions;
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

              <MDBContainer class="form-group">
                <p>Poll Title</p>
                <input type="GroupName" placeholder="Poll title" className="form-control textBox" id="pollTitle" maxLength="100" value={this.state.pollTitleValue} onChange={this.handlePollTitleChange}/>
                <button id="groupBtn" className="button" onClick={() => this.savePollTitle()}>Save</button>
              </MDBContainer>

              <MDBContainer class="form-group">
                <p>Poll Description</p>
                <textarea type="pollDescription" placeholder="Poll description" className="form-control textBox" id="pollDescription" maxLength="100" value={this.state.pollDescriptionValue} onChange={this.handlePollDescriptionChange}></textarea>
                <button id="descriptionBtn" className="button" onClick={() => this.savePollDescription()}>Save</button>
              </MDBContainer>
            </MDBContainer>

            <MDBContainer className="Poll_Editor_box box">
              <p className="fontSizeLarge">
                Poll Question Editor {this.props.pollID}
              </p>

              <div id="poll_questions" className="Poll_Editor_center">
                {this.state.questions.length === 0 ? (
                  <p>Sorry, you don't have any polls.<br/> <br/></p>
                ) : (
                  <React.Fragment>
                    {console.log(this.state.questions)}
                    {this.state.questions.map((value, index) => (
                      <div id={"question-" + (index+1)}>
                        {console.log(value)}
                        {this.state.reorderQuestions && <span className="Poll_Editor_reorder" onClick={() => this.moveQuestionUp(index)}>↑</span>}
                        <button style={{  width: "17em" }} className="button" onClick={() => this.editQuestion(value[0])}>{"Question " + (index+1) + ": " + value[0].QuestionText}</button>
                        {this.state.reorderQuestions && <span className="Poll_Editor_reorder" onClick={() => this.moveQuestionDown(index)}>↓</span>}
                      </div>
                    ))}
                    <button type="submit" id="reorderQuestionsBtn" className="button" onClick={() => this.reorderQuestions()}>Reorder Questions</button>
                  </React.Fragment>
                )}

                <MDBContainer class="form-group">
                  <input className="display_none form-control textBox" id="question_title_input" placeholder="Title"></input>
                  <input className="display_none form-control textBox" id="question_input" placeholder="Question"></input>
                  <button type="submit" id="newQuestionBtn" className="button" onClick={() => this.createNewQuestion()}>New Question</button>
                  <button type="submit" id="newQuestionCancelButton" className="button display_none Poll_Editor_cancel_button" onClick={() => this.cancelNewQuestion()}>Cancel</button>
                </MDBContainer>
              </div>

              {this.state.displayQuestionEditor &&
                <MDBContainer class="form-group">
                  <input className="form-control textBox" id="edit_question_title_input" placeholder="Edit Title" value={this.state.pollQuestionTitleValue} onChange={this.handlePollQuestionTitleChange}></input>
                  <input className="form-control textBox" id="edit_question_input" placeholder="Edit Question" value={this.state.pollQuestionValue} onChange={this.handlePollQuestionChange}></input>
                  <button type="submit" id="editQuestionBtn" className="button" onClick={() => this.submitEditQuestion()}>Save</button>
                </MDBContainer>
              }
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
