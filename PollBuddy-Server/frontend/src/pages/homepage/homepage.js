import React, {Component} from "react";
import "./homepage.scss"
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import logo from "../../images/logo.png";
import {Link} from "react-router-dom";

export default class homepage extends Component {

  componentDidMount(){
    this.props.updateTitle("Home");
  }

  render() {
    return (
      <MDBContainer>
        <header className="Homepage-header">
          <img src={logo} className="img-fluid animated bounce infinite logo" alt="logo" />

          <p className = "blurb"> An interactive questionnaire platform made by students, for
                        students, to strengthen lecture material and class attentiveness.
          </p>

          <MDBContainer className="text-right">
            <Link to="/login">
              <button className = "btn button">Sign In</button>
            </Link>
            <Link to="/registerDefault">
              <button className = "btn button">Sign Up</button>
            </Link>
          </MDBContainer>

        </header>
      </MDBContainer>
    )
  }
}
