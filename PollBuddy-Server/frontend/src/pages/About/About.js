import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import aboutMdPath from "./About.md";

export default class About extends Component {

  constructor(props) {
    super(props);
    this.state = {terms: null};
  }

  componentWillMount() {
    fetch(aboutMdPath).then((response) => response.text()).then((text) => {
      this.setState({terms: text});
    });
  }

  componentDidMount() {
    this.props.updateTitle("About");
  }

  render() {
    return (
      <MDBContainer className="page">
        <div className="box box-body-text">
          {/* Render page from markdown file using react-markdown */}
          <ReactMarkdown source={this.state.terms} unwrapDisallowed={true} />
        </div>
      </MDBContainer>
    );
  }
}
