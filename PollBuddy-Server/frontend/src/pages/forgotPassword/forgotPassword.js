import React, { Component } from 'react';
import './forgotPassword.scss'
import { Router, Link } from '@reach/router';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

export default class pollCode extends Component {
  render() {
    return (
    		<MDBContainer fluid className="forgot-homepage">
    			<MDBContainer fluid className="header">
	    			<img src="logo.svg" class="img-fluid logo poll-logo">
	                </img>
                    <button class = "btn sign-button">Sign in</button>
    			</MDBContainer>
                <MDBContainer fluid className="forgot-box">
                    <h1 class="forgot-text">
                        Forgot Password?
                    </h1>
                    <p class="forgot-blurb">
                        Enter your email and we will send you a reset.
                    </p>
                    <div className="form-group">
                        <input type="email" className="form-control" placeholder="Enter Email" class="enterEmail"/>
                    </div>
                    <button class = "btn email-button">Reset Password</button>
                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
