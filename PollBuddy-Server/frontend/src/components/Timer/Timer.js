import React from "react";
import { MDBContainer } from "mdbreact";
import Countdown from "react-countdown";
import "./Timer.scss";
import { useCall } from "../../hooks";

const subTimer = text => <span style={{ whiteSpace: "pre" }}>{text}</span>;

const clockDays = ({ formatted }) => subTimer(formatted.days);
const clockHours = ({ formatted }) => subTimer(formatted.hours);
const clockMins = ({ formatted }) => subTimer(formatted.minutes);
const clockSecs = ({ formatted }) => subTimer(formatted.seconds);

// CloseTime is stored in milliseconds.
function Timer({ timeLeft, CloseTime, onTimeEnd, noTimeLeft }) {
  // When the entire timer is done (seconds is 0), noTimeLeft should also be
  // called.
  const handleEnd = useCall(noTimeLeft, onTimeEnd);
  
  if (timeLeft) {
    return (
      <MDBContainer>
        <MDBContainer className="time-grid" title="Question Countdown">
          <button className="button time-info">
            <Countdown
              renderer={clockDays} date={CloseTime} onComplete={onTimeEnd}/>
          </button>
          <button className="button time-info">
            <Countdown
              renderer={clockHours} date={CloseTime} onComplete={onTimeEnd}/>
          </button>
          <button className="button time-info">
            <Countdown
              renderer={clockMins} date={CloseTime} onComplete={onTimeEnd}/>
          </button>
          <button className="button time-info">
            <Countdown
              renderer={clockSecs} date={CloseTime} onComplete={handleEnd}/>
          </button>
          <button className="time-info-text">
            <span>Days</span>
          </button>
          <button className="time-info-text">
            <span>Hrs</span>
          </button>
          <button className="time-info-text">
            <span>Mins</span>
          </button>
          <button className="time-info-text">
            <span>Secs</span>
          </button>
        </MDBContainer>
      </MDBContainer>
    );
  } else {
    return (
      <button className="button time-info-closed" title="Question Countdown">
        Question Closed!
      </button>
    );
  }
}

export default React.memo(Timer);