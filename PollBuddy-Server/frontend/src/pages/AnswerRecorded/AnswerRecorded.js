import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import Countdown, {zeroPad} from "react-countdown";
import { MDBContainer } from "mdbreact";
import { Link, Redirect } from "react-router-dom";


export default class recorded extends Component {
  componentDidMount(){
    this.props.updateTitle("Answer Recorded!");
  }
  timeLimit = 5;

  render() {
    const clockFormat = ({ minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        return <Redirect to={"/QuestionEnded"} />;
      } else {
        // Render a countdown
        return <p className="fontSizeLarge">{zeroPad(minutes)}:{zeroPad(seconds)}</p>;
      }
    };
    return (
      <MDBContainer fluid className="page">
        <Link to={"/pollViewer"}>
          <button className = "btn button">Change Answer?</button>
        </Link>
        <p className="fontSizeLarge">
          Time remaining:
        </p>
        <Countdown renderer={clockFormat} date={Date.now() + this.timeLimit*1000} />

        <Link to={"/myclasses"}>
          <button className = "btn button">Leave Poll?</button>
        </Link>

        <p className="fontSizeSmall"> Waiting for next question... </p>


      </MDBContainer>
    );
  }
}
