import React, { Component } from 'react';
import './registerDefault.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import new_logo from "../../Poll_Buddy_Logo_v6.png";


export default class registerDefault extends Component {
  render() {
    return (
    		<MDBContainer fluid className="register-homepage">
    			<MDBContainer fluid className="header">
                    <img src={new_logo} alt="logo" className="poll-logo"/>

	    			<form>
                        <button className = "btn sign-button" formAction="/login" >Sign in</button>
                    </form>
                    </MDBContainer>
                <MDBContainer fluid className="box">
                    <h1 className="register-text">
                        Register for Poll Buddy
                    </h1>
                    <p className="register-blurb">
                        Click on one of the following buttons to register.
                    </p>
                    <button className="btn school-button">Register with School</button>
                    <button className="btn poll-buddy-button">Register with Poll Buddy</button>
                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
