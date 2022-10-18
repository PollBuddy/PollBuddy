import React from "react";
import "mdbreact/dist/css/mdb.css";
import Countdown from "react-countdown";
import { MDBContainer } from "mdbreact";
import { Link, Navigate } from "react-router-dom";
import { useTitle } from "../../hooks";

const clockFormat = ({ formatted: { minutes, seconds }, completed }) => {
  if (completed) {
    // Render a completed state.
    return <Navigate push to="/QuestionEnded" />;
  } else {
    // Render a countdown.
    return <p className="fontSizeLarge">{minutes}:{seconds}</p>;
  }
};

function AnswerRecorded() {
  useTitle("Answer Recorded!");

  const timeLimit = 5;

  return (
    <MDBContainer fluid className="page">
      <Link to="/pollViewer">
        <button className = "button">Change Answer?</button>
      </Link>
      <p className="fontSizeLarge">Time remaining:</p>
      <Countdown renderer={clockFormat} date={Date.now() + 1000*timeLimit} />

      <Link to="/myclasses">
        <button className = "button">Leave Poll?</button>
      </Link>

      <p className="fontSizeSmall"> Waiting for next question... </p>
    </MDBContainer>
  );
}

export default React.memo(AnswerRecorded);