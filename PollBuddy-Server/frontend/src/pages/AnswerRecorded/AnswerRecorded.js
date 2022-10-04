import React from "react";
import "mdbreact/dist/css/mdb.css";
import Countdown, { zeroPad } from "react-countdown";
import { MDBContainer } from "mdbreact";
import { Link, Navigate } from "react-router-dom";

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
};

function Recorded({ updateTitle }) {
  const timeLimit = 5;

  React.useEffect(() => {
    updateTitle?.("Answer Recorded!");
  }, [ updateTitle ]);

  return (
    <MDBContainer fluid className="page">
      <Link to={"/pollViewer"}>
        <button className = "button">Change Answer?</button>
      </Link>
      <p className="fontSizeLarge">
        Time remaining:
      </p>
      <Countdown renderer={ClockFormat} date={Date.now() + 1000*timeLimit} />

      <Link to={"/myclasses"}>
        <button className = "button">Leave Poll?</button>
      </Link>

      <p className="fontSizeSmall"> Waiting for next question... </p>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default Recorded;