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
        <p className="fontSizeSmall">
					Name:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="SIS Man" className="form-control textBox"/>
        </MDBContainer>

        <p className="fontSizeSmall">
					Email:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="mans@rpi.edu" className="form-control textBox"/>
        </MDBContainer>

        <p className="fontSizeSmall">
					Current password:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="shir1ey-is-my-gir1y" className="form-control textBox"/>
        </MDBContainer>

        <p className="fontSizeSmall">
					Confirm password:
        </p>
        <MDBContainer className="form-group">
          <input placeholder="shir1ey-is-my-gir1y" className="form-control textBox"/>
        </MDBContainer>
        <Link to={"/myclasses"}>
          <button className="btn button">Submit</button>
        </Link>
      </MDBContainer>
    )
  }
}
