import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import "./PollViewer.scss";
import { MDBContainer } from "mdbreact";
import Countdown, {zeroPad} from "react-countdown";
import {Link} from "react-router-dom";

export default class PollViewer extends Component {
  componentDidMount() {
    this.props.updateTitle("Poll Viewer");
  }

  timeLimit = 5;

  state = {
    display: 0
  }

  pollViewer() {
    return (
      <MDBContainer>
        <MDBContainer className="page">
          <MDBContainer className="box PollViewer-answers">
            <p>
              Question 3 of 28:
            </p>
            <p className="fontSizeLarge">
              Why does the tooth fairy collect teeth?
            </p>

            <ul>

              <li id="answerElement0">
                <a href={"/answerRecorded"}><span className={"PollViewer-bubble"}>A</span>She grinds them into the fairy
                  dust she needs to fly
                </a>
              </li>
              <li id="answerElement1">
                <a href={"/answerRecorded"}><span className={"PollViewer-bubble"}>B</span>She gives them to new babies
                  who are ready to grow teeth
                </a>
              </li>
              <li id="answerElement2">
                <a href={"/answerRecorded"}><span className={"PollViewer-bubble"}>C</span>She gives the good teeth to
                  dentists to make false teeth
                </a>
              </li>
              <li id="answerElement3">
                <a href={"/answerRecorded"}><span className={"PollViewer-bubble"}>D</span>She grinds them up and makes
                  sand for the beach
                </a>
              </li>
              <li id="answerElement4">
                <a href={"/answerRecorded"}><span className={"PollViewer-bubble"}>E</span>She needs to replace her own
                  teeth
                </a>
              </li>
            </ul>

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }

  answerRecorded() {
    return (
      <MDBContainer fluid className="page">
        <button className="btn button" onClick={this.setState({display: 0})}>Change Answer?</button>
        <Link to={"/myclasses"}>
          <button className="btn button">Leave Poll?</button>
        </Link>

        <p className="width-45 fontSizeSmall">Waiting for next question...</p>


      </MDBContainer>
    );
  }

  questionEnded() {
    return (
      <MDBContainer fluid className="page">
        <p className="width-45 fontSizeLarge">Question closed by instructor!</p>
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
    );
  }


  /*
    changeDisplay(param) {
      this.setState({ display: param }, () => {
        console.log(this.state.display);
      })
    };
  */
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
    let timer = (
      <MDBContainer fluid className="page">
        <p className="width-90 fontSizeLarge">
          Time remaining:
        </p>
        <Countdown renderer={clockFormat} date={Date.now() + this.timeLimit * 1000}/>
      </MDBContainer>
    );
    return(
        timer
    );
  }
}