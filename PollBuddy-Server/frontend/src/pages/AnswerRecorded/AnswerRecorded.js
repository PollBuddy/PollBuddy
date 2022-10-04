import React from "react";
import "mdbreact/dist/css/mdb.css";
import Countdown, { zeroPad } from "react-countdown";
import { MDBContainer } from "mdbreact";
import { Link, Navigate } from "react-router-dom";
import { useTitle } from '../../hooks';

/*----------------------------------------------------------------------------*/

function ClockFormat({ minutes, seconds, completed }) {
  if (completed) {
    // Render a completed state.
    return <Navigate to="/QuestionEnded" push/>;
  } else {
    // Render a countdown.
    return (
      <p className="fontSizeLarge">
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </p>
    );
  }
}

function Recorded({ updateTitle }) {
  useTitle(updateTitle, "Answer Recorded!");

  const timeLimit = 5000;

  return (
    <MDBContainer fluid className="page">
      <Link to={"/pollViewer"}>
        <button className = "button">Change Answer?</button>
      </Link>
      <p className="fontSizeLarge">
        Time remaining:
      </p>
      <Countdown renderer={ClockFormat} date={Date.now() + timeLimit} />

      <Link to={"/myclasses"}>
        <button className = "button">Leave Poll?</button>
      </Link>

      <p className="fontSizeSmall"> Waiting for next question... </p>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default Recorded;