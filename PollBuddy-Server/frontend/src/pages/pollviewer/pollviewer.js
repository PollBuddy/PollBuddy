import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import "./pollviewer.scss";
import { MDBContainer } from 'mdbreact';

export default class pollviewer extends Component {
    componentDidMount(){
        this.props.updateTitle("Poll Viewer");
    }
    render() {
        return (
            <MDBContainer>
                <MDBContainer className="page">
                    <p className="fontSizeSmall">
                        Question 3 of 28:
                    </p>
                    <p className="bold fontSizeLarge">
                        Why does the tooth fairy collect teeth?
                    </p>

                    <ul>
                        <MDBContainer className="answer">
                            <li id="answerElement0"><a href={"#1"}><span className={"answerBubble"}>A</span><span className={"answerText fontSizeSmall"}> She grinds them into the fairy dust she needs to fly</span></a></li>
                        </MDBContainer>

                        <MDBContainer className="answer">
                            <li id="answerElement1"><a href={"#2"}><span className={"answerBubble"}>B</span><span className={"answerText fontSizeSmall"}> She gives them to new babies who are ready to grow teeth</span></a></li>
                        </MDBContainer>

                        <MDBContainer className="answer">
                            <li id="answerElement2"><a href={"#3"}><span className={"answerBubble"}>C</span><span className={"answerText fontSizeSmall"}> She gives the good teeth to dentists to make false teeth</span></a></li>
                        </MDBContainer>

                        <MDBContainer className="answer">
                            <li id="answerElement3"><a href={"#4"}><span className={"answerBubble"}>D</span><span className={"answerText fontSizeSmall"}> She grinds them up and makes sand for the beach</span></a></li>
                        </MDBContainer>

                        <MDBContainer className="answer">
                            <li id="answerElement4"><a href={"#5"}><span className={"answerBubble"}>E</span><span className={"answerText fontSizeSmall"}> She needs to replace her own teeth</span></a></li>
                        </MDBContainer>

                    </ul>

            </MDBContainer>
        </MDBContainer>
      )
    }
}