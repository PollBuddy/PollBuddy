import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { LoadingWheel, QuestionResults } from "../../components";
import "./PollResults.scss";
import { useAsyncEffect, useFn, useTitle } from "../../hooks";
import { useParams } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function QuestionBar({ current, index: i, onClick }) {
  const handleClick = useFn(onClick, i);
  const name = current === i
    ? "question-label question-label-active"
    : "question-label question-label-inactive";

  return <div><div className={name} onClick={handleClick}>{i + 1}</div></div>;
}

function QuestionResult({ current, index: i, question }) {
  const data = React.useMemo(() => ({
    questionNumber: current + 1,
    question,
  }), [ current, question ]);

  if (current !== i) { return null; }

  return <QuestionResults data={data}/>;
}

function PollResults() {
  useTitle("Poll Results");

  const { pollID } = useParams();
  const [ error, setError ] = React.useState(null);
  const [ loaded, setLoaded ] = React.useState(false);
  const [ questions, setQuestions ] = React.useState([ ]);
  const [ current, setCurrent ] = React.useState(0);

  useAsyncEffect(async () => {
    const response = await fetch(`${BACKEND}/polls/${pollID}/results`, {
      method: "GET"
    });

    const data = await response.json();
    if (data.result === "success") {
      setLoaded(true);
      setQuestions(data.data.questions);
    } else {
      setError(true);
      // for(let i = 0; i < this.state.questionData.CorrectAnswers.length-1; i++){
      //   this.setState({correctAnswers : this.state.correctAnswers + this.state.questionData.CorrectAnswers[i] + ", "});
      // }
      // this.setState({correctAnswers: this.state.correctAnswers + this.state.questionData.CorrectAnswers[this.state.questionData.CorrectAnswers.length-1]});
      // this.setState({"doneLoading": true});
    }
  }, [ setLoaded, setQuestions, setError, pollID ]);

  // eslint-disable-next-line no-unused-vars
  const questionBar = questions.map((_, i) => (
    <QuestionBar key={i} current={current} index={i} onClick={setCurrent}/>
  ));

  const questionResults = questions.map((question, i) => (
    <QuestionResult key={i} current={current} index={i} question={question}/>
  ));

  if (error) {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Error loading data! Please try again.
          </p>
        </MDBContainer>
      </MDBContainer>
    );
  } else if (!loaded) {
    return (
      <MDBContainer className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  } else {
    return (
      <MDBContainer fluid className="page">
        <div className="questions-bar">{questionBar}</div>
        {questionResults}
        <a id="downloadBtn" className="button"
          href={`${BACKEND}/polls/${pollID}/csv`}>
          Download full results CSV
        </a>
      </MDBContainer>
    );
  }
}

export default React.memo(PollResults);
