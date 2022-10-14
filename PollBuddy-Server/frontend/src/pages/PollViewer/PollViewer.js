import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { Question, LoadingWheel, Timer } from "../../components";
import "./PollViewer.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useAsyncEffect, useFn, useTitle } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

// Uses the Fischer-Yates Shuffle Algorithm.
function shuffleArray(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function PollTimer(props) {
  const { perPoll, pollCloseTime, pollTimeLeft, noPollTimeLeft } = props;

  // Check to see if there's < 100 days left and only show if there is. This is
  // maybe to hide a visual bug lol, but also because we really probably don't
  // need to show a remaining time if it's that far away.
  const timeLeft = Date.parse(pollCloseTime) - Date.now();
  const timeStyles = { width: "275px", maxWidth: "275px" };

  if (perPoll && timeLeft < 100 * 24 * 60 * 60 * 1000) {
    return (
      <div>
        <MDBContainer className="box" style={timeStyles}>
          <MDBContainer>
            <span>Poll Time Remaining</span>
          </MDBContainer>
          <Timer timeLeft={pollTimeLeft} noTimeLeft={noPollTimeLeft}
            CloseTime={pollCloseTime} />
        </MDBContainer>
        <br />
        <br />
      </div>
    );
  }
}

function PollViewer() {
  useTitle("Poll Viewer");

  const navigate = useNavigate();
  const { pollID } = useParams();
  const [ loaded, setLoaded ] = React.useState(false);
  const [ perPoll, ] = React.useState(true);
  const [ pollCloseTime, setPollCloseTime ] = React.useState("");
  const [ pollTimeLeft, setPollTimeLeft ] = React.useState(true);
  const [ , setPollTitle ] = React.useState("");
  const [ , setPollDesc ] = React.useState("");
  const [ questions, setQuestions ] = React.useState("");
  const [ current, setCurrent ] = React.useState(0);
  const [ error, setError ] = React.useState("");

  useAsyncEffect(async () => {
    const resp = await fetch(BACKEND + "/polls/" + pollID, { method: "GET" });
    const data = await resp.json();

    console.log(data);
    if (data.result === "success") {
      if (data.data.questions.length === 0) {
        setError("This poll has no questions for you to answer at this time.");
      }

      for (const question of data.data.questions) {
        shuffleArray(question.answers);
        let currentAnswers = [ ...question.selectedAnswers ];
        let savedAnswers = localStorage.getItem(question.id);
        if (savedAnswers) { currentAnswers = JSON.parse(savedAnswers); }
        question.currentAnswers = currentAnswers;
      }

      setPollTitle(data.data.title);
      setPollDesc(data.data.description);
      setQuestions(data.data.questions);
      // setPerPoll(data.data.perPoll);
      setPollCloseTime(data.data.pollCloseTime);
      setLoaded(true);
    } else if (data.error) {
      setError(true);

      switch (data.error.errorCode) {
      case 100:
        setError("Invalid Poll: Poll does not exist");
        break;
      case 101:
        setError("You are not a member of the group associated with this poll");
        break;
      case 102:
        setError("You must login in order to access this poll");
        break;
      case 103:
        setError("The poll you are trying to access is currently not allowin" +
          "g submissions");
        break;
      default:
        break;
      }
    } else {
      // Invalid poll ID given.
      navigate("/");
    }
  }, [ ]);

  const nextQuestion = React.useCallback(() => {
    let newQuestion = current + 1;
    if (newQuestion >= questions.length) { newQuestion = -1; }
    setCurrent(newQuestion);
  }, [ current, questions.length ]);

  const updateQuestion = React.useCallback(newAnswers => {
    const currQuestion = {
      ...questions[current],
      currentAnswers: newAnswers
    };

    const newQuestions = [ ...questions ];
    newQuestions[current] = currQuestion;

    localStorage.setItem(currQuestion.id, JSON.stringify(newAnswers));
    setQuestions(newQuestions);
  }, [ current, questions ]);

  const noPollTimeLeft = useFn(setPollTimeLeft, false);

  if (error) {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">{error}</p>
        </MDBContainer>
      </MDBContainer>
    );
  } else if (!loaded) {
    return (
      <MDBContainer className="page">
        <LoadingWheel />
      </MDBContainer>
    );
  } else if (current === -1) {
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
    const questionBar = [];
    const questionResults = [];

    for (let index = 0; index < questions.length; index++) {
      questionBar.push(
        <div
          key={index}
          className={
            current === index
              ? "question-label question-label-active"
              : "question-label question-label-inactive"
          }
          onClick={() => setCurrent(index)}
        >
          {index + 1}
        </div>
      );

      if (current !== index) {
        questionResults.push(null);
      } else {
        questionResults.push(
          <Question
            nextQuestion={nextQuestion}
            updateQuestion={updateQuestion}
            key={index}
            data={{
              pollID: pollID,
              questionNumber: current + 1,
              question: questions[current],
              perPoll: perPoll,
            }}
          />
        );
      }
    }

    return (
      <MDBContainer className="page" style={{ justifyContent: "start" }}>
        <PollTimer perPoll={perPoll} pollCloseTime={pollCloseTime} pollTimeLeft={pollTimeLeft} noPollTimeLeft={noPollTimeLeft}/>
        <div className="questions-bar">
          {questionBar}
        </div>
        {questionResults}
      </MDBContainer>
    );
  }
}

export default React.memo(PollViewer);
