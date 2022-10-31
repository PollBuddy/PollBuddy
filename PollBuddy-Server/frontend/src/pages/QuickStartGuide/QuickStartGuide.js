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

  async componentDidMount() {
    const response = await fetch(quickStartGuide);
    const text = await response.text();
    this.setState({terms: text});
  }

  componentDidMount() {
    this.props.updateTitle("QuickStartGuide");
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
