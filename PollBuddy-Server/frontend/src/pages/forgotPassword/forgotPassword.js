import React, { Component } from 'react';
import './forgotPassword.scss'
import { Router, Link } from '@reach/router';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

import Header from "../../components/header/header.js"

export default class pollCode extends Component {
  render() {
    return (
    		<MDBContainer fluid className="forgot-homepage">
    			<Header title = "forgot password" btn = "login" />
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
