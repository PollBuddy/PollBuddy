import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import privacyMdPath from "./Privacy.md";

export default class Privacy extends Component {

  constructor(props) {
    super(props);
    this.state = {terms: null};
  }

  componentWillMount() {
    fetch(privacyMdPath).then((response) => response.text()).then((text) => {
      this.setState({terms: text});
    });
  }

  Component(){
    this.setState({terms:text});
  }

  componentDidMount() {
    this.props.updateTitle("Privacy");
  }

  render() {

    return (
      <MDBContainer className="page">
        <MDBContainer className="box box-body-text">
          <h1>Our Privacy Policy</h1>
          {/* Render page from markdown file using react-markdown */}
          <ReactMarkdown children={this.state.terms} />
        </MDBContainer>
      </MDBContainer>
    );
  }
}
