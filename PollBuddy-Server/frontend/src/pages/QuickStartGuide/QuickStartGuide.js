import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import quickStartGuide from "./QuickStartGuide.md";

export default class QuickStartGuide extends Component {

  constructor(props) {
    super(props);
    this.state = {terms: null};
  }

  componentDidMount() {
    this.props.updateTitle("QuickStartGuide");
    fetch(quickStartGuide).then((response) => response.text()).then((text) => {
      this.setState({terms: text});
    });
  }

  render() {
    return (
      <MDBContainer className="page">
        <div className="box box-body-text">
          {/* Render page from markdown file using react-markdown */}
          <ReactMarkdown children={this.state.terms} unwrapDisallowed={true} />
        </div>
      </MDBContainer>
    );
  }
}
