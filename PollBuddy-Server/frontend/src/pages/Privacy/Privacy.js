import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import privacyMdPath from "./Privacy.md";
import faqFile from "../FAQ/faq.md";

export default class Privacy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      terms: null
    };
  }

  componentWillMount() {
    this.getText();
  }

  async getText() {
    const httpResponse = await fetch(privacyMdPath);
    const text = await httpResponse.text();
    this.setState({questions: text});
  }

  componentDidMount() {
    this.props.updateTitle("Privacy");
  }

  render() {

    return (
      <MDBContainer className="page">
        <MDBContainer className="box box-body-text">
          <h1>Our Privacy Policy</h1>
          <ReactMarkdown children={this.state.terms}/>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
