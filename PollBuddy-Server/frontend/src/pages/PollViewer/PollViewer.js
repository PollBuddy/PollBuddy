import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import Question from "../../components/Question/Question";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import "./PollViewer.scss";
import Timer from "../../components/Timer/Timer";

class PollViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollID: props.router.params.pollID,
      showError: null,
      doneLoading: false,
      perPoll: true,
      pollCloseTime: "",
      pollTimeLeft: true,
      pollTitle: "",
      pollDescription: "",
      questions: "",
      currentQuestion: 0,
      errorMessage: "",
    };
  }

  async componentDidMount() {
    this.props.updateTitle("Poll Viewer");
    this.getPollData();
  }

  async getPollData() {
    const httpResponse = await fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.state.pollID, {
      method: "GET",
    });
    const response = await httpResponse.json();
    if (response.result === "success") {
      if (response.data.questions.length === 0) {
        this.setState({
          errorMessage:
            "This poll has no questions for you to answer at this time.",
          showError: true,
        });
      }
      for (let question of response.data.questions) {
        this.shuffleArray(question.answers);
        let currentAnswers = [...question.selectedAnswers];
        let savedAnswers = localStorage.getItem(question.id);
        if (savedAnswers) {
          currentAnswers = JSON.parse(savedAnswers);
        }
        question.currentAnswers = currentAnswers;
      }
      this.setState({
        pollTitle: response.data.title,
        pollDescription: response.data.description,
        questions: response.data.questions,
        //perPoll: response.data.perPoll,
        pollCloseTime: response.data.closeTime,
        doneLoading: true,
      });
    } else if (response.error) {
      this.setState({
        showError: true,
      });
      if (response.error.errorCode === 100) {
        this.setState({
          errorMessage: "Invalid Poll: Poll does not exist",
        });
      } else if (response.error.errorCode === 101) {
        this.setState({
          errorMessage:
            "You are not a member of the group associated with this poll",
        });
      } else if (response.error.errorCode === 102) {
        this.setState({
          errorMessage: "You must login in order to access this poll",
        });
      } else if (response.error.errorCode === 103) {
        this.setState({
          errorMessage:
            "The poll you are trying to access is currently not allowing submissions",
        });
      }
    } else {
      this.props.router.navigate("/polls");
    }
  }

  displayQuestion = (index) => {
    this.setState({
      currentQuestion: index,
    });
  };

  shuffleArray = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  };

  nextQuestion = () => {
    let newQuestion = this.state.currentQuestion + 1;
    if (newQuestion >= this.state.questions.length) {
      newQuestion = -1;
    }
    this.setState({
      currentQuestion: newQuestion,
    });
  };

  updateQuestion = (newAnswers) => {
    this.state.questions[this.state.currentQuestion].currentAnswers =
      newAnswers;
    localStorage.setItem(
      this.state.questions[this.state.currentQuestion].id,
      JSON.stringify(newAnswers)
    );
  };

  noPollTimeLeft = () => {
    this.setState({pollTimeLeft: false});
  };

  render() {
    let pollTimer = () => {
      /* Check to see if there's < 100 days left and only show if there is. This is maybe to hide a visual bug lol,
             but also because we really probably don't need to show a remaining time if it's that far away */
      if (
        this.state.perPoll &&
        Date.parse(this.state.pollCloseTime) - Date.now() <
        100 * 24 * 60 * 60 * 1000
      ) {
        return (
          <div>
            <MDBContainer
              className="box"
              style={{width: "275px", maxWidth: "275px"}}
            >
              <MDBContainer>
                <span>Poll Time Remaining</span>
              </MDBContainer>
              <Timer
                timeLeft={this.state.pollTimeLeft}
                noTimeLeft={() => this.noPollTimeLeft()}
                CloseTime={this.state.pollCloseTime}
                onTimeEnd={this.onTimeEnd}
              />
            </MDBContainer>
            <br/>
            <br/>
          </div>
        );
      }
    };

    if (this.state.showError) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">{this.state.errorMessage}</p>
          </MDBContainer>
        </MDBContainer>
      );
    } else if (!this.state.doneLoading) {
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else if (this.state.currentQuestion === -1) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              You've reached the end of the poll. Thanks for submitting!
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page" style={{justifyContent: "start"}}>
          {pollTimer()}
          <div className="questions-bar">
            {this.state.questions.map((question, index) => {
              return (
                <div
                  className={
                    this.state.currentQuestion === index
                      ? "question-label question-label-active"
                      : "question-label question-label-inactive"
                  }
                  onClick={() => this.displayQuestion(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
          {this.state.questions.map((question, index) => {
            if (this.state.currentQuestion === index) {
              return (
                <Question
                  nextQuestion={this.nextQuestion}
                  updateQuestion={this.updateQuestion}
                  data={{
                    pollID: this.state.pollID,
                    questionNumber: this.state.currentQuestion + 1,
                    question: this.state.questions[this.state.currentQuestion],
                    perPoll: this.state.perPoll,
                  }}
                />
              );
            }
          })}
        </MDBContainer>
      );
    }
  }
}

export default withRouter(PollViewer);
