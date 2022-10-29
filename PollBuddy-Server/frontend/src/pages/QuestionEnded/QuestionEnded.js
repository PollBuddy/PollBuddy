import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import {Link} from "react-router-dom";

export default class QuestionEnded extends Component {

  componentDidMount() {
    this.props.updateTitle("Question Ended!");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <p className="fontSizeLarge"> Question closed by instructor! </p>
        {/*TODO: show this only if the instructor allows*/}
        <Link to={"/pollDataView"}>
          <button className="button">View Statistics for this question</button>
        </Link>
        <Link to={"/myclasses"}>
          <button className="button">Leave Poll?</button>
        </Link>
        <p className="fontSizeSmall"> Waiting for next question... </p>
        <p className="fontSizeLarge">______</p>
        <p className="fontSizeLarge">/---add---\</p>
        <p className="fontSizeLarge">|--loading--|</p>
        <p className="fontSizeLarge">\---here--/</p>
        <p className="fontSizeLarge">‾‾‾‾‾‾</p>
      </MDBContainer>
    );
  }
}
