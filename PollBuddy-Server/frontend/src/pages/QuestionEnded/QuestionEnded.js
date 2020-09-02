import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

export default class ended extends Component {

  componentDidMount(){
    this.props.updateTitle("Question Ended!");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <p className="width-45 fontSizeLarge"> Question closed by instructor! </p>
        {/*TODO: show this only if the instructor allows*/}
        <Link to={"/pollDataView"}>
          <button className = "btn button">View Statistics for this question</button>
        </Link>
        <Link to={"/myclasses"}>
          <button className = "btn button">Leave Poll?</button>
        </Link>

        <p className="width-45 fontSizeSmall"> Waiting for next question... </p>

        <p className="width-45 fontSizeLarge">______</p>
        <p className="width-45 fontSizeLarge">/---add---\</p>
        <p className="width-45 fontSizeLarge">|--loading--|</p>
        <p className="width-45 fontSizeLarge">\---here--/</p>
        <p className="width-45 fontSizeLarge">‾‾‾‾‾‾</p>

      </MDBContainer>
    );
  }
}
