import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";

export default class about extends Component {
  componentDidMount() {
    this.props.updateTitle("About");
  }

  render() {
    return (
      <MDBContainer className="page">
        
      </MDBContainer>
    )
  }
}