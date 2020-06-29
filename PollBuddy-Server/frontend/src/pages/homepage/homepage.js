import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import "./homepage.scss";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";

export default class homepage extends Component {

  componentDidMount(){
    this.props.updateTitle("Home");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <img src={logo} alt="logo" className="homepage_logo img-fluid" />

        <p className="width-45 fontSizeSmall"> An interactive questionnaire platform made by students, for
                    students, to strengthen lecture material and class attentiveness.</p>
        <MDBContainer>
          <Link to={"/login"}>
            <button className = "btn button">Login</button>
          </Link>
          <Link to={"/registerDefault"}>
            <button className = "btn button">Register</button>
          </Link>
        </MDBContainer>

        <p className="width-45 fontSizeSmall"> Already have a Poll Code? Enter it here.</p>
        <p className="width-45 fontSizeSmall"> Poll Code:</p>

        <MDBContainer className="form-group">
          <input placeholder="K30SW8" className="form-control textBox"/>
        </MDBContainer>

        <Link to={"/pollviewer"}>
          <button className = "btn button">Join Poll</button>
        </Link>

      </MDBContainer>
    )
  }
}
