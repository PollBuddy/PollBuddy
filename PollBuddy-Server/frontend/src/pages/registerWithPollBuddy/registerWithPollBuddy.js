import React, { Component } from 'react';
import './registerWithPollBuddy.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

import Header from "../../components/header/header.js"
import Footer from "../../components/footer/footer.js"

export default class registerWithPollBuddy extends Component {
    componentDidMount(){
        document.title = "Register With Us - " + document.title;
    }
  render() {
    return (
    		<MDBContainer fluid>
    	        <Header title = "Register with us" btn = "login" />
                <MDBContainer fluid className="p-b-box">
                    <h1 className="register-text">
                        Register with Poll Buddy
                    </h1>
                    <p className="register-blurb">
                        To create an account, fill in the text boxes, then press submit.
                    </p>
                    <MDBContainer className="form-group">
                        <input type="email" className={`${"enterName"} ${"form-control"}`} placeholder="Enter your name"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input type="email" className={`${"enterEmail"} ${"form-control"}`} placeholder="Enter your email"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input type="email" className={`${"enterPassword"} ${"form-control"}`} placeholder="Enter your password"/>
                    </MDBContainer>
                    <form>
                        <button className="btn submit-button2" formAction="/accountinfo" >Submit</button>
                    </form>
                </MDBContainer>
                <Footer />
    		</MDBContainer>
    	)
	}
}
