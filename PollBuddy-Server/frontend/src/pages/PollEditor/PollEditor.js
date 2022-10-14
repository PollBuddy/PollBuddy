import React from "react";
import { MDBContainer } from "mdbreact";
import autosize from "autosize";
import "./PollEditor.scss";
import { LoadingWheel } from "../../components";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { purple } from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import { selectTarget, useAsyncEffect, useCompose, useTitle } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function PollEditor() {
  useTitle("Poll Editor");

  const navigate = useNavigate();
  const { pollID } = useParams();
  const [ questions, setQuestions ] = React.useState([ ]);
  const [ pollTitle, setPollTitle ] = React.useState("");
  const [ pollDescription, setPollDescription ] = React.useState("");
  const [ openTime, setOpenTime ] = React.useState(Date.now());
  const [ closeTime, setCloseTime ] = React.useState(Date.now());
  const [ loadingPollQuestions, setLoadingPollQuestions ] = React.useState(false);

  const [ currentQuestion, setCurrentQuestion ] = React.useState(false);
  const [ currentAnswers, setCurrentAnswers ] = React.useState([ ]);
  const [ displayNewQuestion, setDisplayNewQuestion ] = React.useState(false);
  const [ displayEditQuestion, setDisplayEditQuestion ] = React.useState(false);
  const [ questionTextInput, setQuestionTextInput ] = React.useState("");
  const [ maxAllowedChoices, setMaxAllowedChoices ] = React.useState(1);
  const [ loadingPollData, setLoadingPollData ] = React.useState(true);

  useAsyncEffect(async () => {
    autosize(document.querySelector("textarea"));

    const response = await fetch(BACKEND + "/polls/" + pollID, {
      method: "GET"
    });

    const { data } = await response.json();
    console.log(response);

    setPollTitle(data.title);
    setPollDescription(data.description);
    setQuestions(data.questions);
    setOpenTime(data.openTime);
    setCloseTime(data.closeTime);
    setLoadingPollData(false);
  }, [ pollID, setPollTitle, setPollDescription, setQuestions, setOpenTime,
    setCloseTime ]);

  const savePoll = React.useCallback(async () => {
    setLoadingPollData(true);

    const response = await fetch(BACKEND + "/polls/" + pollID + "/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: pollTitle,
        description: pollDescription,
        openTime: openTime,
        closeTime: closeTime,
      })
    });

    await response.json();
    setLoadingPollData(false);
  }, [ pollID, setLoadingPollData, pollTitle, pollDescription, openTime,
    closeTime ]);

  const deletePoll = React.useCallback(async () => {
    await fetch(BACKEND + "/polls/" + pollID + "/delete", { method: "POST" });
    navigate("/groups");
  }, [ pollID, navigate ]);

  const createQuestion = React.useCallback(() => {
    setCurrentQuestion(false);
    setCurrentAnswers([ ]);
    setQuestionTextInput("");
    setDisplayNewQuestion(true);
    setMaxAllowedChoices(1);
  }, [ ]);

  const editQuestion = React.useCallback(question => {
    setCurrentQuestion(question);
    setCurrentAnswers(structuredClone(question.answers));
    setQuestionTextInput(question.text);
    setMaxAllowedChoices(question.maxAllowedChoices);
    setDisplayEditQuestion(true);
  }, [ ]);

  const submitEdit = React.useCallback(async () => {
    const response = await fetch(`${BACKEND}/polls/${pollID}/createQuestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: questionTextInput,
        answers: currentAnswers,
        maxAllowedChoices: maxAllowedChoices,
      }),
    });

    const { result, data } = await response.json();

    if (result === "success") {
      setCurrentQuestion(false);
      setCurrentAnswers([ ]);
      setMaxAllowedChoices(1);
      setDisplayNewQuestion(false);
      setQuestions(state => [ ...state, data ]);
    }

    setLoadingPollQuestions(false);
  }, [ currentAnswers, maxAllowedChoices, pollID, questionTextInput ]);

  const submitNew = React.useCallback(async () => {
    const response = await fetch(`${BACKEND}/polls/${pollID}/editQuestion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentQuestion.id,
        text: questionTextInput,
        answers: currentAnswers,
        maxAllowedChoices: maxAllowedChoices,
      })
    });

    const { result, data } = await response.json();
    if (result === "success") {
      let newQuestions = [ ...questions ];
      let currentQuestionIndex = -1;

      for (const questionIndex in newQuestions) {
        if (newQuestions[questionIndex].id === currentQuestion.id) {
          currentQuestionIndex = questionIndex;
          break;
        }
      }

      if (currentQuestionIndex !== -1) {
        newQuestions[currentQuestionIndex] = data;
      }
      
      setQuestions(newQuestions);
      setCurrentQuestion(false);
      setCurrentAnswers([ ]);
      setMaxAllowedChoices(1);
      setDisplayEditQuestion(false);
    }

    setLoadingPollQuestions(false);
  }, [ currentAnswers, currentQuestion.id, maxAllowedChoices, pollID, questions,
    questionTextInput ]);

  const submitQuestion = React.useCallback(async () => {
    setLoadingPollQuestions(true);

    if (displayNewQuestion) {
      submitEdit();
    } else if (displayEditQuestion) {
      submitNew();
    }
  }, [ displayEditQuestion, displayNewQuestion, submitEdit, submitNew ]);

  const cancelQuestion = React.useCallback(() => {
    setDisplayNewQuestion(false);
    setDisplayEditQuestion(false);
  }, [ ]);

  const addAnswer = React.useCallback(() => {
    setCurrentAnswers(state => [
      ...state,
      { text: "", correct: false }
    ]);
  }, [ ]);

  const deleteAnswer = React.useCallback(answerIndex => {
    setCurrentAnswers(state => {
      const next = state.slice();
      next.splice(answerIndex, 1);
      return next;
    });
  }, [ ]);

  const onAnswerInput = React.useCallback(e => {
    setCurrentAnswers(state => {
      const answers = state.slice();
      answers[parseInt(e.target.name)].text = e.target.value;
      return answers;
    });
  }, [ ]);

  const onAnswerCheck = React.useCallback(e => {
    setCurrentAnswers(state => {
      const answers = state.slice();
      answers[parseInt(e.target.name)].correct ^= true; // Just toggles value.
      return answers;
    });
  }, [ ]);

  const incrementMaxAllowedChoices = React.useCallback(increment => {
    setMaxAllowedChoices(value => Math.max(value + increment, 1));
  }, [ ]);

  const onOpenTimeChange = useCompose(setOpenTime, e => Date.parse(e));
  const onCloseTimeChange = useCompose(setCloseTime, e => Date.parse(e));

  const defaultMaterialTheme = createTheme({
    palette: { primary: purple, secondary: purple },
  });

  const color = "#ffffff";

  const handlePollTitle = useCompose(setPollTitle, selectTarget);
  const handlePollDescription = useCompose(setPollDescription, selectTarget);
  const handleQuestionTextInput = useCompose(setQuestionTextInput, selectTarget);

  if (loadingPollData) {
    return (
      <MDBContainer fluid className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer>
      <MDBContainer className="page">
        <MDBContainer className="two-box">
          <MDBContainer className="Poll_Editor_box box">
            <p className="fontSizeLarge">Poll Details</p>
            <p>Poll Title</p>
            <input type="GroupName" placeholder="Poll title"
              className="form-control textBox" id="pollTitle" maxLength="100"
              name="pollTitle" value={pollTitle} onChange={handlePollTitle}/>

            <p>Poll Description</p>
            <textarea placeholder="Poll description" id="pollDescription"
              value={pollDescription} maxLength="100" name="pollDescription"
              className="form-control textBox" onChange={handlePollDescription}/>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ThemeProvider theme={defaultMaterialTheme}>
                <DateTimePicker label="Poll Open Time" value={openTime}
                  onChange={onOpenTimeChange} renderInput={props => (
                    <TextField {...props} sx={{
                      svg: { color },
                      input: { color },
                      label: { color }
                    }}/>
                  )}/>
              </ThemeProvider>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ThemeProvider theme={defaultMaterialTheme}>
                <DateTimePicker label="Poll Close Time" value={closeTime}
                  onChange={onCloseTimeChange} renderInput={props => (
                    <TextField {...props} sx={{
                      svg: { color },
                      input: { color },
                      label: { color }
                    }}/>
                  )}/>
              </ThemeProvider>
            </LocalizationProvider>

            <div className="pollButtons">
              <button id="descriptionBtn" className="button pollButton"
                onClick={savePoll}>
                Save Changes
              </button>
              <button id="descriptionBtn" className="button pollButton"
                onClick={deletePoll}>
                Delete Poll
              </button>
            </div>
            <div className="pollButtons">
              <Link to={`/polls/${pollID}/view`} className="button pollButton">
                Open viewer
              </Link>
            </div>
            <div className="pollButtons">
              <Link to={`/polls/${pollID}/results`} className="button pollButton">
                Open results graph
              </Link>
              <a id="downloadBtn" className="button pollButton"
                href={BACKEND + "/polls/" + pollID + "/csv"}>
                Download results CSV
              </a>
            </div>
          </MDBContainer>
          <MDBContainer className="Poll_Editor_box box">
            <p className="fontSizeLarge">Poll Questions</p>
            {loadingPollQuestions ?
              <MDBContainer>
                <LoadingWheel/>
              </MDBContainer> :
              <>
                { !(displayEditQuestion || displayNewQuestion) &&
                  <div id="poll_questions" className="Poll_Editor_center">
                    {questions.length === 0 && !displayNewQuestion ? (
                      <p>Sorry, you don't have any questions.</p>
                    ) : (
                      <React.Fragment>
                        {questions.map((question, index) => (
                          <div key={index} id={"question-" + (index+1)}>
                            <button
                              style={{  width: "17em" }} className="button"
                              onClick={() => editQuestion(question)}
                            >
                              {"Question " + (index+1) + ": " + question.text}
                            </button>
                          </div>
                        ))}
                      </React.Fragment>
                    )}
                    <button
                      type="submit" id="newQuestionBtn" className="button"
                      onClick={createQuestion}
                    >
                      New Question
                    </button>
                  </div>
                }
                { (displayEditQuestion || displayNewQuestion) &&
                  <>
                    <MDBContainer className="form-group">
                      <input
                        className="form-control textBox"
                        placeholder="Question"
                        name="questionTextInput"
                        value={questionTextInput}
                        onChange={handleQuestionTextInput}
                      />
                    </MDBContainer>
                    <div className="maxAllowedChoices">
                      <p>
                        Max Allowed Choices
                      </p>
                      <button
                        type="submit" className="button"
                        onClick={() => incrementMaxAllowedChoices(1)}
                      >
                        +
                      </button>
                      <p className="fontSizeLarge">
                        {maxAllowedChoices}
                      </p>
                      <button
                        type="submit" className="button"
                        onClick={() => incrementMaxAllowedChoices(-1)}
                      >
                        -
                      </button>
                    </div>
                    <p className="fontSizeLarge">
                      Answers
                    </p>
                    {currentAnswers.length === 0 ? (
                      <p>Sorry, this question has no answers.</p>
                    ) : (
                      <React.Fragment>
                        {currentAnswers.map((value, index) => (
                          <div key={index} className="questionAnswer">
                            <input
                              id={"questionAnswer-" + (index)}
                              className="form-control textBox"
                              placeholder={"Answer " + (index+1)}
                              name={index}
                              value={value.text}
                              onInput={onAnswerInput}
                            />
                            <input
                              type="checkbox"
                              className="checkBox"
                              name={index}
                              checked={value.correct}
                              onChange={onAnswerCheck}
                            />
                            <button
                              type="submit" className="button"
                              onClick={() => deleteAnswer(index)}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </React.Fragment>
                    )}
                    <button
                      type="submit" className="button"
                      onClick={addAnswer}
                    >
                      Add Answer
                    </button>

                    <MDBContainer className="form-group">
                      <button
                        type="submit" className="button"
                        onClick={submitQuestion}
                      >
                        {displayNewQuestion ? "Create" : "Save"}
                      </button>
                      <button
                        type="submit" className="button"
                        onClick={cancelQuestion}
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

export default React.memo(PollEditor);
