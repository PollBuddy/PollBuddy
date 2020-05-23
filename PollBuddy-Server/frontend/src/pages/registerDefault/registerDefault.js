import React, { Component } from 'react';
import './registerDefault.scss'
import {MDBBtn, MDBContainer} from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import {Link} from "react-router-dom";

export default class registerDefault extends Component {
    componentDidMount(){
        document.title = "Register - " + document.title;
    }
  render() {
    return (
    		<MDBContainer fluid className="register-homepage">
                <MDBContainer fluid className="box">
                    <h1 className="register-text">
                        Register for Poll Buddy
                    </h1>
                    <p className="register-blurb">
                        Click on one of the following buttons to register.
                    </p>

                   <Link to={"/registerWithSchool"}>
                      <MDBBtn size="lg" color="black" className="btn school-button">Register with School</MDBBtn>
                   </Link>

                   <Link to={"/registerWithPollBuddy"}>
                      <MDBBtn size="lg" color="black" className="btn poll-buddy-button">Register with PollBuddy</MDBBtn>
                   </Link>

                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
