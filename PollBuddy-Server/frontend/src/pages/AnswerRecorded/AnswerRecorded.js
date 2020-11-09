import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import Countdown, {zeroPad} from "react-countdown";
import {MDBContainer} from "mdbreact";
import {Link, Redirect} from "react-router-dom";


export default class recorded extends Component {
  componentDidMount() {
    this.props.updateTitle("Answer Recorded!");
  }

  timeLimit = 5;

  questionEnded() {
    return (
      <MDBContainer fluid className="page">
        <p className="width-45 fontSizeLarge">Question closed by instructor!</p>
        {/*TODO: show this only if the instructor allows*/}
        <Link to={"/pollDataView"}>
          <button className="btn button">View Statistics for this question</button>
        </Link>
        <Link to={"/myclasses"}>
          <button className="btn button">Leave Poll?</button>
        </Link>

        <p className="width-45 fontSizeSmall">Waiting for next question...</p>

        <p className="width-45 fontSizeLarge">______</p>
        <p className="width-45 fontSizeLarge">/---add---\</p>
        <p className="width-45 fontSizeLarge">|--loading--|</p>
        <p className="width-45 fontSizeLarge">\---here--/</p>
        <p className="width-45 fontSizeLarge">‾‾‾‾‾‾</p>

      </MDBContainer>
    )
  }

  render() {
    const clockFormat = ({minutes, seconds, completed}) => {
      if (completed) {
        // Render a completed state
        return this.questionEnded();
      } else {
        // Render a countdown
        return <p className="width-90 fontSizeLarge">{zeroPad(minutes)}:{zeroPad(seconds)}</p>;
      }
    };
    return (
      <MDBContainer fluid className="page">
        <Link to={"/pollViewer"}>
          <button className="btn button">Change Answer?</button>
        </Link>
        <p className="width-90 fontSizeLarge">
          Time remaining:
        </p>
        <Countdown renderer={clockFormat} date={Date.now() + this.timeLimit * 1000}/>

        <Link to={"/myclasses"}>
          <button className="btn button">Leave Poll?</button>
        </Link>

        <p className="width-45 fontSizeSmall">Waiting for next question...</p>


      </MDBContainer>
    );
  }
}
