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
          <MDBContainer className="box">
            <p className="fontSizeLarge bold">
                CSCI 1200 - Data Structures
            </p>

            {/*TODO: arrows should represent active polls rather than mouse hover*/}
            <ul>
              <li id="poll0" className="instructorView_element"><a href={"/instructorLiveStats"}><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/><span className={"instructorView_text fontSizeSmall"}> Lesson #1 - vectors</span></a></li>
              <li id="poll1" className="instructorView_element"><a href={"/instructorLiveStats"}><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/><span className={"instructorView_text fontSizeSmall"}> Lesson #2 - linked lists</span></a></li>
              <li id="poll2" className="instructorView_element"><a href={"/instructorLiveStats"}><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/><span className={"instructorView_text fontSizeSmall"}> Lesson #3 - sets</span></a></li>
              <li id="poll3" className="instructorView_element"><a href={"/instructorLiveStats"}><MDBIcon className="arrow" icon="long-arrow-alt-right" size="lg"/><span className={"instructorView_text fontSizeSmall"}> Lesson #4 - unordered maps</span></a></li>
            </ul>

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    )
  }
}