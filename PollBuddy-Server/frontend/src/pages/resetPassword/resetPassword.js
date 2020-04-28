import React, { Component } from 'react';
import './resetPassword.scss'
import { MDBContainer } from 'mdbreact';
import {Link } from "@reach/router"

import 'mdbreact/dist/css/mdb.css';

import Header from "../../components/header/header.js"

export default class resetPassword extends Component {

    componentDidMount(){
        document.title = "Reset Password - " + document.title;
    }

    render() {
        return (
    		<MDBContainer fluid className="reset-homepage">
    			<Header title = "Reset password" btn = "login" />
                <MDBContainer fluid className="reset-box">
                    <p className="reset-blurb">
                        Enter the security code from your inbox and your new password.
                    </p>

                    {/*TODO: autofill the security code*/}
                    <MDBContainer className="form-group">
                        <input type="securityCode" className={`${"form-control"} ${"enterSecurityCode"}`} placeholder="Autofilled security code"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input type="newPassword" className={`${"form-control"} ${"enterPassword"}`} placeholder="Enter new password"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input type="confirmPassword" className={`${"form-control"} ${"confirmPassword"}`} placeholder="Confirm new password"/>
                    </MDBContainer>

                    {/*Should this link to the myclasses page? Submitting your new password means you are logging in*/}
                    <Link to={"/accountinfo"}>
                        <button className = "btn submit-button">Submit</button>
                    </Link>
                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
