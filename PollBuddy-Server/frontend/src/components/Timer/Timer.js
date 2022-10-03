import React from "react";
import { MDBContainer } from "mdbreact";
import Countdown, { zeroPad } from "react-countdown";
import "./Timer.scss";

/*----------------------------------------------------------------------------*/

function Timer({ noTimeLeft, timeLeft, CloseTime, onTimeEnd }) {
  const clockFormatDays = React.useCallback(({ days, completed }) => {
    if (completed) {
      // Render a completed state.
      return <span>00</span>;
    } else {
      // Render a countdown.
      return <span>{zeroPad(days)}</span>;
    }
  }, [ zeroPad ]);

  const clockFormatHours = React.useCallback(({ hours, completed }) => {
    if (completed) {
      // Render a completed state.
      return <span>00</span>;
    } else {
      // Render a countdown.
      return <span>{zeroPad(hours)}</span>;
    }
  }, [ zeroPad ]);

  const clockFormatMinutes = React.useCallback(({ minutes, completed }) => {
    if (completed) {
      // Render a completed state.
      return <span>00</span>;
    } else {
      // Render a countdown.
      return <span>{zeroPad(minutes)}</span>;
    }
  }, [ zeroPad ]);

  const clockFormatSeconds = React.useCallback(({ seconds, completed }) => {
    if (completed) {
      // Render a completed state.
      noTimeLeft();
      return <span>00</span>;
    } else {
      // Render a countdown.
      return <span>{zeroPad(seconds)}</span>;
    }
  }, [ zeroPad ]);

  return timeLeft ? (
    <MDBContainer>
      <MDBContainer className="time-grid" title = "Question Countdown">
        <button className = "button time-info">
          <Countdown
            renderer={clockFormatDays}
            date={CloseTime} // Stored in milliseconds.
            onComplete={onTimeEnd}/>
        </button>
        <button className = "button time-info">
          <Countdown
            renderer={clockFormatHours}
            date={CloseTime} // Stored in milliseconds.
            onComplete={onTimeEnd}/>
        </button>
        <button className = "button time-info">
          <Countdown
            renderer={clockFormatMinutes}
            date={CloseTime} // Stored in milliseconds.
            onComplete={onTimeEnd}/>
        </button>
        <button className = "button time-info">
          <Countdown
            renderer={clockFormatSeconds}
            date={CloseTime} // Stored in milliseconds.
            onComplete={onTimeEnd}/>
        </button>
        <button className={"time-info-text"}>
          <span>Days</span>
        </button>
        <button className={"time-info-text"}>
          <span>Hrs</span>
        </button>
        <button className={"time-info-text"}>
          <span>Mins</span>
        </button>
        <button className={"time-info-text"}>
          <span>Secs</span>
        </button>
      </MDBContainer>
    </MDBContainer>
  ) : (
    <button className="button time-info-closed" title="Question Countdown">
      Question Closed!
    </button>
  );
}

/*----------------------------------------------------------------------------*/

export default Timer;