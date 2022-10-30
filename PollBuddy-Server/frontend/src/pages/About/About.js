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

  componentDidMount() {
    this.props.updateTitle("About");
    this.getText();
  }

  async getText() {
    const httpResponse = await fetch(aboutMdPath);
    const text = await httpResponse.text();
    this.setState({terms: text});
  }

  render() {
    return (
      <MDBContainer className="page">
        <div className="box box-body-text">
          <ReactMarkdown children={this.state.terms} unwrapDisallowed={true}/>
        </div>
      </MDBContainer>
    );
  }
}
