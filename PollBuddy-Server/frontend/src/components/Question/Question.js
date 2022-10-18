import React from "react";
import "./Question.scss";
import { MDBContainer } from "mdbreact";
import { useFn } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function _Answer({ selectAnswer, selected, answer, index }) {
  const { id, text } = answer;
  const handleClick = useFn(selectAnswer, id);

  const selectClass = selected // "question-label-bubble"
    ? "question-label-bubble question-label-bubble-active"
    : "question-label-bubble question-label-bubble-inactive";

  return (
    <div className="question-btn-and-text" onClick={handleClick}>
      <MDBContainer className={selectClass}>{LETTERS[index]}</MDBContainer>
      {text}
    </div>
  );
}

const Answer = React.memo(_Answer);

function Question({ updateQuestion, nextQuestion, data }) {
  const { question, questionNumber, pollID } = data;
  const [ answers, setAnswers ] = React.useState(question.currentAnswers ?? []);
  const timeLeft = true;

  // onTimeEnd() {
  //   this.setState({ canChoose: false });
  // }

  // selectChoice(index) {
  //   if(!this.state.canChoose){
  //     return;
  //   }
  //   let tempChoices = this.state.studentChoices;
  //   let count = 0;
  //   //push the index to the queue
  //   this.state.choicesQueue.push(index);
  //   //count the number of booleans that are true in the array
  //   for (let i = 0; i < this.state.studentChoices.length; i++) {
  //     if (this.state.studentChoices[i]) {
  //       count++;
  //     }
  //   }
  //   //if the number of true booleans is greater than the maximum number of
  //   //allowed choices (specified by the json) then pop from the queue to set
  //   //the first choice chosen back to false
  //   if (count >= this.state.data.MaxAllowedChoices) {
  //     tempChoices[this.state.choicesQueue.shift()] = false;
  //   }
  //   //make the boolean at the selected index true and update state
  //   tempChoices[index] = true;
  //   this.setState(prevState => ({
  //     ...prevState,
  //     studentChoices: tempChoices,
  //   }));
  // }

  // noTimeLeft = () => {
  //   this.setState({timeLeft: false});
  // };

  const selectAnswer = React.useCallback(answerID => {
    const nextAnswers = [ ...answers ];
    const i = nextAnswers.indexOf(answerID);

    if (i >= 0) {
      nextAnswers.splice(i, 1);
    } else {
      nextAnswers.push(answerID);
      if (nextAnswers.length > question.maxAllowedChoices) {
        nextAnswers.shift();
      }
    }

    updateQuestion(nextAnswers);
    setAnswers(nextAnswers);
  }, [ answers, updateQuestion, setAnswers, question ]);

  const submitQuestion = React.useCallback(async () => {
    const resp = await fetch(`${BACKEND}/polls/${pollID}/submitQuestion/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: question.id, answers: answers })
    });

    const out = await resp.json();
    console.log(out);
    nextQuestion();
  }, [ question, answers, nextQuestion, pollID ]);

  const answerViews = question.answers.map((answer, index) => (
    <Answer key={index}
      answer={answer}
      index={index}
      selectAnswer={selectAnswer}
      selected={answers.indexOf(answer.id) >= 0}/>
  ));

  return (
    <MDBContainer className="box">
      <p className="fontSizeLarge">
        Question {questionNumber}: {question.text}
      </p>
      { question.img && // Only display image if there is one.
        <img className="question-img-fluid" src={data.img} alt=""/>
      }
      <MDBContainer>{answerViews}</MDBContainer>
      {/*
      This should work, but is being commented out for now since
      per-question times are not implemented fully yet:
      
      <MDBContainer className = "button time-info-label">
        <span>Question Time Remaining</span>
      </MDBContainer>
      <Timer timeLeft={this.state.timeLeft} noTimeLeft={() => this.noTimeLeft()}
        CloseTime={this.state.closeTime} onTimeEnd={this.onTimeEnd} />
      */}
      <MDBContainer>
        { timeLeft &&
          <button className="button" onClick={submitQuestion}>Save</button>
        }
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(Question);