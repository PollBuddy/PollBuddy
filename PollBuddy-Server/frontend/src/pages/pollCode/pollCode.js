import React, { Component } from "react";
import "./pollCode.scss"
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import logo from "../../images/logo.png";

export default class pollCode extends Component {
  componentDidMount(){
    this.props.updateTitle("Poll Code");
  }
  render() {
    return (
      <MDBContainer>
    		<MDBContainer fluid className="poll-homepage">
          <img src={logo} className="img-fluid animated bounce infinite logo" alt="logo" />

	    		<div className="form-group">
			      <input type="email" className="form-control enterCode" placeholder="Poll Code" />
			    </div>
			    <button className = "btn poll-button">Join Poll</button>
    		</MDBContainer>
      </MDBContainer>
    )
  }
}