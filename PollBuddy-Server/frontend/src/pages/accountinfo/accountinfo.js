import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import {Link} from "react-router-dom";

export default class accountinfo extends Component {
  componentDidMount(){
    this.props.updateTitle("Account Info");
  }

  render() {
    return (
      <MDBContainer className="page">
        <p className="fontSizeSmall" id="nameText">
					Name:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="SIS Man" className="form-control textBox" aria-labelledby="nameText"/>
        </MDBContainer>

        <p className="fontSizeSmall" id="emailText">
					Email:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="mans@rpi.edu" className="form-control textBox" aria-labelledby="emailText"/>
        </MDBContainer>

        <p className="fontSizeSmall" id="currentPasswordText">
					Current password:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="shir1ey-is-my-gir1y" className="form-control textBox" aria-labelledby="currentPasswordText"/>
        </MDBContainer>

        <p className="fontSizeSmall" id="confirmPassworkText">
					Confirm password:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="shir1ey-is-my-gir1y" className="form-control textBox" aria-labelledby="confirmPassworkText"/>
        </MDBContainer>
        <Link to={"/myclasses"}>
          <button className="btn button">Submit</button>
        </Link>
      </MDBContainer>
    )
  }
}
