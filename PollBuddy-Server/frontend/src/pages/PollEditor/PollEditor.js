import React, {Component} from "react";
import { MDBContainer } from "mdbreact";
import autosize from "autosize";
import "./PollEditor.scss";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { purple } from '@mui/material/colors';
import {createTheme, ThemeProvider} from "@mui/material";

class PollEditor extends Component {
  constructor(props) {
    super(props);
    this.askQuestion = this.askQuestion.bind(this);
    this.handleRandomize = this.handleRandomize.bind(this);

    this.state = {
      askedQuestions: [],
      questionDispatcherIndex: 0,
      pollTitleValue: "",
      pollDescriptionValue: "",
      displayQuestionEditor: false,
      pollQuestionTitleValue: "",
      pollQuestionValue: "",
      reorderQuestions: false,
      randomQuestions: false,

      pollID: props.router.params.pollID,
      doneLoading: false,
      questions: [],
      pollTitle: "",
      pollDescription: "",
      openTime: Date.now(),
      closeTime: Date.now(),
      loadingPollQuestions: false,
      showQuestionError: false,

      currentQuestion: false,
      currentAnswers: [],
      displayNewQuestion: false,
      displayEditQuestion: false,
      questionTextInput: "",
      maxAllowedChoices: 1,

      loadingPollData: true,
    };
  }

  componentDidMount() {
    autosize(document.querySelector("textarea"));
    this.props.updateTitle("Poll Editor");
    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID, {
      method: "GET"
    })
      .then(response => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          pollTitle: response.data.title,
          pollDescription: response.data.description,
          questions: response.data.questions,
          openTime: response.data.openTime,
          closeTime: response.data.closeTime,
          loadingPollData: false,
        });
      });
  }

  handleRandomize() {
    this.setState({randomQuestions: !this.state.randomQuestions});
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

  onInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  getPollData = () => {
    return {
      title: this.state.pollTitle,
      description: this.state.pollDescription,
      openTime: this.state.openTime,
      closeTime: this.state.closeTime,
    };
  };

  savePoll = () => {
    this.setState({
      loadingPollData: true,
    });
    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID + "/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.getPollData())
    })
      .then(response => response.json())
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            showError: false,
            loadingPollData: false,
          });
        } else {
          this.setState({
            showError: true,
            loadingPollData: false,
          });
        }
      });
  };

  deletePoll = async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID + "/delete", {
      method: "POST",
    });
    this.props.router.navigate("/groups");
  };

  createQuestion = () => {
    this.setState({
      currentQuestion: false,
      currentAnswers: [],
      questionTextInput: "",
      displayNewQuestion: true,
      maxAllowedChoices: 1,
    });
  };

  editQuestion = (question) => {
    this.setState({
      currentQuestion: question,
      currentAnswers: JSON.parse(JSON.stringify(question.answers)),
      questionTextInput: question.text,
      maxAllowedChoices: question.maxAllowedChoices,
      displayEditQuestion: true,
    });
  };

  submitQuestion = () => {
    this.setState({
      showQuestionError: false,
      loadingPollQuestions: true,
    });
    if (this.state.displayNewQuestion) {
      fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID + "/createQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: this.state.questionTextInput,
          answers: this.state.currentAnswers,
          maxAllowedChoices: this.state.maxAllowedChoices,
        })
      })
        .then(response => response.json())
        .then((response) => {
          if (response.result === "success") {
            this.setState({
              showQuestionError: false,
              currentQuestion: false,
              currentAnswers: [],
              maxAllowedChoices: 1,
              loadingPollQuestions: false,
              displayNewQuestion: false,
              questions: [...this.state.questions, response.data],
            });
          } else {
            this.setState({
              showQuestionError: true,
              loadingPollQuestions: false,
            });
          }
        });
    } else if (this.state.displayEditQuestion) {
      fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID + "/editQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: this.state.currentQuestion.id,
          text: this.state.questionTextInput,
          answers: this.state.currentAnswers,
          maxAllowedChoices: this.state.maxAllowedChoices,
        })
      })
        .then(response => response.json())
        .then((response) => {
          if (response.result === "success") {
            let questions = [...this.state.questions];
            let currentQuestionIndex = -1;
            for (let questionIndex in questions) {
              if (questions[questionIndex].id === this.state.currentQuestion.id) {
                currentQuestionIndex = questionIndex;
                break;
              }
            }
            if (currentQuestionIndex !== -1) {
              questions[currentQuestionIndex] = response.data;
            }
            this.setState({
              questions: questions,
              showQuestionError: false,
              currentQuestion: false,
              currentAnswers: [],
              maxAllowedChoices: 1,
              loadingPollQuestions: false,
              displayEditQuestion: false,
            });
          } else {
            this.setState({
              showQuestionError: true,
              loadingPollQuestions: false,
            });
          }
        });
    }
  };

  cancelQuestion = () => {
    this.setState({
      displayNewQuestion: false,
      displayEditQuestion: false,
    });
  };

  addAnswer = () => {
    this.setState({
      currentAnswers: [...this.state.currentAnswers, {
        text: "",
        correct: false,
      }]
    });
  };

  deleteAnswer = (answerIndex) => {
    let currentAnswers = [...this.state.currentAnswers];
    currentAnswers.splice(answerIndex, 1);
    this.setState({
      currentAnswers: currentAnswers,
    });
  };

  onAnswerInput = (e) => {
    let currentAnswers = [...this.state.currentAnswers];
    currentAnswers[parseInt(e.target.name)].text = e.target.value;
    this.setState({
      currentAnswers: currentAnswers,
    });
  };

  onAnswerCheck = (e) => {
    let currentAnswers = [...this.state.currentAnswers];
    currentAnswers[parseInt(e.target.name)].correct = !currentAnswers[parseInt(e.target.name)].correct;
    this.setState({
      currentAnswers: currentAnswers,
    });
  };

  incrementMaxAllowedChoices = (increment) => {
    let maxAllowedChoices = this.state.maxAllowedChoices + increment;
    if (maxAllowedChoices <= 0) {
      maxAllowedChoices = 1;
    }
    this.setState({
      maxAllowedChoices: maxAllowedChoices,
    });
  };

  reorderQuestions() {
    this.setState({reorderQuestions: !this.state.reorderQuestions});
  }

  moveQuestionUp(index) {
    let reorderedQuestions = this.move(index, index-1);
    this.setState({questions: reorderedQuestions});
  }

  moveQuestionDown(index) {
    let reorderedQuestions = this.move(index, index+1);
    this.setState({questions: reorderedQuestions});
  }

  move(oldIndex, newIndex) {
    if (oldIndex > newIndex && oldIndex === 0) {
      newIndex = this.state.questions.length - 1;
    }
    if (oldIndex < newIndex && oldIndex === this.state.questions.length - 1) {
      newIndex = 0;
    }
    this.state.questions.splice(newIndex, 0, this.state.questions.splice(oldIndex, 1)[0]);
    return this.state.questions;
  }

  onOpenTimeChange = (e) =>{
    this.setState({openTime: Date.parse(e)});
  };
  onCloseTimeChange = (e) =>{
    this.setState({closeTime: Date.parse(e)});
  };

  render() {
    const defaultMaterialTheme = createTheme({
      palette: {
        primary: purple,
        secondary: purple,
      },
    });
    const color = "#ffffff";
    if (this.state.loadingPollData) {
      return (
        <MDBContainer fluid className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer>
          <MDBContainer className="page">
            <MDBContainer className="two-box">
              <MDBContainer className="Poll_Editor_box box">
                <p className="fontSizeLarge">
                  Poll Details
                </p>
                <p>Poll Title</p>
                <input
                  type="GroupName" placeholder="Poll title" className="form-control textBox" id="pollTitle" maxLength="100"
                  name="pollTitle"
                  value={this.state.pollTitle}
                  onChange={this.onInput}/>
                <p>Poll Description</p>
                <textarea
                  placeholder="Poll description" className="form-control textBox" id="pollDescription" maxLength="100"
                  name="pollDescription"
                  value={this.state.pollDescription}
                  onChange={this.onInput}/>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <ThemeProvider theme={defaultMaterialTheme}>
                    <DateTimePicker
                      label="Poll Open Time"
                      value={this.state.openTime}
                      onChange={this.onOpenTimeChange}
                      renderInput={(props) => <TextField {...props} sx={{
                        svg: { color },
                        input: { color },
                        label: { color }
                      }}
                      />}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <ThemeProvider theme={defaultMaterialTheme}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} sx={{
                        svg: { color },
                        input: { color },
                        label: { color }
                      }}
                      />}
                      label="Poll Close Time"
                      value={this.state.closeTime}
                      onChange={this.onCloseTimeChange}
                    />
                  </ThemeProvider>
                </LocalizationProvider>
                <div className={"pollButtons"}>
                  <button
                    id="descriptionBtn" className="button pollButton"
                    onClick={this.savePoll}
                  >
                    Save Changes
                  </button>
                  <button
                    id="descriptionBtn" className="button pollButton"
                    onClick={this.deletePoll}
                  >
                    Delete
                  </button>
                </div>
              </MDBContainer>
              <MDBContainer className="Poll_Editor_box box">
                <p className="fontSizeLarge">
                  Poll Questions
                </p>

                {this.state.loadingPollQuestions ?
                  <MDBContainer>
                    <LoadingWheel/>
                  </MDBContainer> :
                  <>
                    { !(this.state.displayEditQuestion || this.state.displayNewQuestion) &&
                      <div id="poll_questions" className="Poll_Editor_center">
                        {this.state.questions.length === 0 && !this.state.displayNewQuestion ? (
                          <p>Sorry, you don't have any questions.</p>
                        ) : (
                          <React.Fragment>
                            {this.state.questions.map((question, index) => (
                              <div id={"question-" + (index+1)}>
                                <button
                                  style={{  width: "17em" }} className="button"
                                  onClick={() => this.editQuestion(question)}
                                >
                                  {"Question " + (index+1) + ": " + question.text}
                                </button>
                              </div>
                            ))}
                          </React.Fragment>
                        )}
                        <button
                          type="submit" id="newQuestionBtn" className="button"
                          onClick={this.createQuestion}
                        >
                          New Question
                        </button>
                      </div>
                    }
                    { (this.state.displayEditQuestion || this.state.displayNewQuestion) &&
                      <>
                        <MDBContainer className="form-group">
                          <input
                            className="form-control textBox"
                            placeholder="Question"
                            name="questionTextInput"
                            value={this.state.questionTextInput}
                            onChange={this.onInput}
                          />
                        </MDBContainer>
                        <div className="maxAllowedChoices">
                          <p>
                            Max Allowed Choices
                          </p>
                          <button
                            type="submit" className="button"
                            onClick={() => { this.incrementMaxAllowedChoices(1); }}
                          >
                            +
                          </button>
                          <p className="fontSizeLarge">
                            {this.state.maxAllowedChoices}
                          </p>
                          <button
                            type="submit" className="button"
                            onClick={() => { this.incrementMaxAllowedChoices(-1); }}
                          >
                            -
                          </button>
                        </div>
                        <p className="fontSizeLarge">
                          Answers
                        </p>
                        {this.state.currentAnswers.length === 0 ? (
                          <p>Sorry, this question has no answers.</p>
                        ) : (
                          <React.Fragment>
                            {this.state.currentAnswers.map((value, index) => (
                              <div className="questionAnswer">
                                <input
                                  id={"questionAnswer-" + (index)}
                                  className="form-control textBox"
                                  placeholder={"Answer " + (index+1)}
                                  name={index}
                                  value={value.text}
                                  onInput={this.onAnswerInput}
                                />
                                <input
                                  type="checkbox"
                                  className="checkBox"
                                  name={index}
                                  checked={value.correct}
                                  onInput={this.onAnswerCheck}
                                />
                                <button
                                  type="submit" className="button"
                                  onClick={() => { this.deleteAnswer(index); }}
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </React.Fragment>
                        )}
                        <button
                          type="submit" className="button"
                          onClick={this.addAnswer}
                        >
                          Add Answer
                        </button>

                        <MDBContainer className="form-group">
                          <button
                            type="submit" className="button"
                            onClick={this.submitQuestion}
                          >
                            {this.state.displayNewQuestion ? "Create" : "Save"}
                          </button>
                          <button
                            type="submit" className="button"
                            onClick={this.cancelQuestion}
                          >
                            Cancel
                          </button>
                        </MDBContainer>
                      </>
                    }
                  </>
                }
              </MDBContainer>
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}

export default withRouter(PollEditor);
