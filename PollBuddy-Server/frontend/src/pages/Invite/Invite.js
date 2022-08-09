import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import GroupInvite from "./Invite.md";



export default class Invite extends Component {

    constructor(props) {
      super(props);
      this.state = {terms: null};
    }
  
    componentWillMount() {
      fetch(GroupInvite).then((response) => response.text()).then((text) => {
        this.setState({terms: text});
      });
    }
  
    componentDidMount() {
      this.props.updateTitle("InvitePage");
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