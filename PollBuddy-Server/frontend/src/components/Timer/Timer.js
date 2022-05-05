import React, { Component } from "react";
import {
  MDBContainer
} from "mdbreact";

import Countdown, { zeroPad } from "react-countdown";
import "./Timer.scss";

export default class Timer extends Component {
  render(){
    const clockFormatDays = ({ days, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(days)}</span>;
      }
    };
    const clockFormatHours = ({ hours, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(hours)}</span>;
      }
    };
    const clockFormatMinutes = ({ minutes, completed }) => {

      if (completed) {
        // Render a completed state
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(minutes)}</span>;
      }
    };
    const clockFormatSeconds = ({ seconds, completed }) => {

      if (completed) {
        // Render a completed state
        this.props.noTimeLeft();
        return <span>00</span>;
      } else {
        // Render a countdown
        return <span>{zeroPad(seconds)}</span>;
      }
    };
    let countdown = ( (this.props.timeLeft) ?(
      <MDBContainer>
        <MDBContainer className="time-grid" title = "Question Countdown">
          <button className = "button time-info">
            <Countdown
              renderer={clockFormatDays}
              date={ this.props.CloseTime }//stored in milliseconds
              onComplete={this.props.onTimeEnd}
            />
          </button>
          <button className = "button time-info">
            <Countdown
              renderer={clockFormatHours}
              date={ this.props.CloseTime }//stored in milliseconds
              onComplete={this.props.onTimeEnd}
            />
          </button>
          <button className = "button time-info">
            <Countdown
              renderer={clockFormatMinutes}
              date={ this.props.CloseTime }//stored in milliseconds
              onComplete={this.props.onTimeEnd}
            />
          </button>
          <button className = "button time-info">
            <Countdown
              renderer={clockFormatSeconds}
              date={ this.props.CloseTime }//stored in milliseconds
              onComplete={this.props.onTimeEnd}
            />
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
      <button className="button time-info-closed" title = "Question Countdown">Question Closed!</button>
    )
    );
    return(countdown);
  }
}