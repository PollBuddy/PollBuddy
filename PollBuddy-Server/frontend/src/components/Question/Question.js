import React from "react";
import "./Question.scss";
import { MDBContainer } from "mdbreact";

/*----------------------------------------------------------------------------*/

const CHOICE_ORDER = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

function Question({ data, updateQuestion, nextQuestion }) {
  const { question, pollID, questionNumber, /*pollCloseTime*/ } = data;

  // const [ questionStartTime, ]  = React.useState(Date.now());
  // const closeTime = new Date();
  // closeTime.setHours(closeTime.getHours() + 2);

  // const [ perPoll, setPerPoll ] = React.useState(true);
  const [ timeLeft, /*setTimeLeft*/ ] = React.useState(true);
  // const [ canChoose, setCanChoose ] = React.useState(false);

  const [
    currentAnswers, setCurrentAnswers
  ] = React.useState(question.currentAnswers ?? []);

  // const selectChoice = React.useCallback(index => {
  //   if (!canChoose) return;

  //   let tempChoices = [ ...studentChoices ];
  //   let count = 0;
  //   // Push the index to the queue.
  //   this.state.choicesQueue.push(index);
  //   // Count the number of booleans that are true in the array.
  //   for (let i = 0; i < this.state.studentChoices.length; i++) {
  //     if (this.state.studentChoices[i]) {
  //       count++;
  //     }
  //   }
  //   //if the number of true booleans is greater than the maximum number of
  //   //allowed choices (specified by the json) then pop from the queue to set the first
  //   //choice chosen back to false
  //   if (count >= this.state.data.MaxAllowedChoices) {
  //     tempChoices[this.state.choicesQueue.shift()] = false;
  //   }
  //   //make the boolean at the selected index true and update state
  //   tempChoices[index] = true;
  //   this.setState(prevState => ({
  //     ...prevState,
  //     studentChoices: tempChoices,
  //   }));
  // }, [ ]);

  // const onTimeEnd = React.useCallback(() => {
  //   setCanChoose(false);
  // }, [ setCanChoose ]);

  // const noTimeLeft = React.useCallback(() => {
  //   setTimeLeft(false);
  // }, [ setTimeLeft ]);

  const isAnswerSelected = React.useCallback(answerID => {
    return currentAnswers.indexOf(answerID) >= 0;
  }, [ currentAnswers ]);

  const selectAnswer = React.useCallback(answerID => {
    const nextAnswers = [ ...currentAnswers ];
    const i = nextAnswers.indexOf(answerID);

    if (i >= 0) {
      nextAnswers.splice(i, 1);
    } else {
      nextAnswers.push(answerID);
      if (nextAnswers.length > question.maxAllowedChoices) {
        nextAnswers.shift();
      }
    }

    updateQuestion?.(nextAnswers);
    setCurrentAnswers(nextAnswers);
  }, [ updateQuestion, setCurrentAnswers, currentAnswers, question ]);

  const getSubmitData = React.useCallback(() => {
    return {
      id: question.id,
      answers: currentAnswers,
    };
  }, [ question, currentAnswers ]);

  const submitQuestion = React.useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/polls/${pollID}/submitQuestion/`;

    const resp = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getSubmitData())
    });

    const json = await resp.json();
    console.log(json);

    nextQuestion?.();
  }, [ pollID, getSubmitData, nextQuestion ]);

  const answer_views = question.answers.map((answer, index) => (
    <btn className={"question-btn-and-text"}
      onClick={() => selectAnswer(answer.id)}>
      <MDBContainer className={ // className="question-label-bubble"
        isAnswerSelected(answer.id) ?
          "question-label-bubble question-label-bubble-active" :
          "question-label-bubble question-label-bubble-inactive"}>
        {CHOICE_ORDER[index]}
      </MDBContainer>
      {answer.text}
    </btn>
  ));

  return (
    <MDBContainer className="box">
      <p className="fontSizeLarge">
        Question {questionNumber}: {question.text}
      </p>

      { // Only display image if there is one.
        question.img &&
        <img
          className="question-img-fluid"
          src={data.img}
          alt=""/>
      }

      <MDBContainer>{answer_views}</MDBContainer>

      {/* This should work, but is being commented out for now since
          per-question times are not implemented fully yet.

      <MDBContainer className = "button time-info-label">
        <span>Question Time Remaining</span>
      </MDBContainer>
      <Timer timeLeft={this.state.timeLeft} noTimeLeft={() => this.noTimeLeft()}
        CloseTime={this.state.closeTime} onTimeEnd={this.onTimeEnd} />
      */}

      <MDBContainer>
        {timeLeft &&
          <button className="button" onClick={submitQuestion}>
            Save
          </button>
        }
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default Question;