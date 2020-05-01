import React, { Component } from 'react';
import './forgotPassword.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

import Header from "../../components/header/header.js"
import Footer from "../../components/footer/footer.js"

export default class pollCode extends Component {

    componentDidMount(){
        document.title = "Forgot Password - " + document.title;
    }

    render() {
        return (
    		<MDBContainer fluid className="forgot-homepage">
    			<Header title = "forgot password" btn = "login" />
                <MDBContainer fluid className="forgot-box">
                    <div className="forgot-text">
                        Forgot Password?
                    </div>
                    <div className="forgot-blurb">
                        Enter your email and we will send you a reset.
                    </div>
                    <input type="email" className="form-control" placeholder="Enter Email" className="enterEmail"/>
                    <button className = "btn email-button">Reset Password</button>
                </MDBContainer>
                <Footer />
    		</MDBContainer>
    	)
	}
}
