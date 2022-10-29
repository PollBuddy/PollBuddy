import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import ReactMarkdown from "react-markdown";
import faqFile from "./faq.md";

export default class FAQ extends Component {

  constructor(props) {
    super(props);
    this.state = {questions: null};
  }

  componentDidMount() {
    this.props.updateTitle("Frequently Asked Questions");
    this.getText();
  }

  async getText() {
    const httpResponse = await fetch(faqFile);
    const text = await httpResponse.text();
    this.setState({questions: text});
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer className="box box-body-text">
          <h1>Frequently Asked Questions</h1>
          <ReactMarkdown children={this.state.questions}/>
        </MDBContainer>
      </MDBContainer>
    );
  }

}
