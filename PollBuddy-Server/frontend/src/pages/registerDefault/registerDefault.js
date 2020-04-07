import React, { Component } from 'react';
import './registerDefault.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import new_logo from "../../Poll_Buddy_Logo_v6.png";

import Header from "../../components/header/header.js"


export default class registerDefault extends Component {
  render() {
    return (
    		<MDBContainer fluid className="register-homepage">
    			<Header title = "Register" btn = "in" />
                <MDBContainer fluid className="box">
                    <h1 className="register-text">
                        Register for Poll Buddy
                    </h1>
                    <p className="register-blurb">
                        Click on one of the following buttons to register.
                    </p>
                    <form>
                        <button className="btn school-button" formAction="/registerWithSchool" >Register with School</button>
                    </form>
                    <form>
                        <button className="btn poll-buddy-button" formAction="/registerWithPollBuddy" >Register with PollBuddy</button>
                    </form>

                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
