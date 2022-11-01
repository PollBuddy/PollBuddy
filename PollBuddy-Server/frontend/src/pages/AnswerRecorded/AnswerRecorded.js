import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import Countdown, {zeroPad} from "react-countdown";
import {MDBContainer} from "mdbreact";
import {Link, Navigate} from "react-router-dom";

const clockFormat = ({minutes, seconds, completed}) => {
  if (completed) {
    return <Navigate to={"/QuestionEnded"} push={true}/>;
  } else {
    return <p className="fontSizeLarge">{zeroPad(minutes)}:{zeroPad(seconds)}</p>;
  }
};

export default class AnswerRecorded extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeLimit: 5,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Answer Recorded!");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <Link to={"/pollViewer"}>
          <button className="button">Change Answer?</button>
        </Link>
        <p className="fontSizeLarge">
          Time remaining:
        </p>
        <Countdown renderer={clockFormat} date={Date.now() + this.timeLimit * 1000}/>
        <Link to={"/myclasses"}>
          <button className="button">Leave Poll?</button>
        </Link>
        <p className="fontSizeSmall"> Waiting for next question... </p>
      </MDBContainer>
    );
  }
}
