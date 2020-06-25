import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./instructorPolls.scss";
import { MDBContainer, MDBIcon } from "mdbreact";

export default class instructorPolls extends Component {
  componentDidMount(){
    this.props.updateTitle("Instructor Polls");
  }
  render() {
    return (
      <MDBContainer>
        <MDBContainer className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
                CSCI 1200 - Data Structures
            </p>

            <ul>
              <li id="poll0" className="instructorView_element text-align-center"><a href={"/pollDataView"}><span className={"instructorView_text fontSizeSmall"}> Lesson Name #1</span><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/></a></li>
              <li id="poll1" className="instructorView_element text-align-center"><a href={"/pollDataView"}><span className={"instructorView_text fontSizeSmall"}> Lesson Name #2</span><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/></a></li>
              <li id="poll2" className="instructorView_element text-align-center"><a href={"/pollDataView"}><span className={"instructorView_text fontSizeSmall"}> Lesson Name #3</span><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/></a></li>
              <li id="poll3" className="instructorView_element text-align-center"><a href={"/pollDataView"}><span className={"instructorView_text fontSizeSmall"}> Lesson Name #4</span><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/></a></li>
            </ul>

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    )
  }
}