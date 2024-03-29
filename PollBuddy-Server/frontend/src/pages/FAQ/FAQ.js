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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    fetch(faqFile).then((response) => response.text()).then((text) => {
      this.setState({questions: text});
    });
  }

  componentDidMount() {
    this.props.updateTitle("Frequently Asked Questions");
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
