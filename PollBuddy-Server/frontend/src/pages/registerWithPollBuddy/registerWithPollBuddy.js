import React, { Component } from 'react';
import './registerWithPollBuddy.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import new_logo from "../../Poll_Buddy_Logo_v6.png";


export default class registerWithPollBuddy extends Component {
  render() {
    return (
    		<MDBContainer fluid className="register-with-school">
    			<MDBContainer fluid className="header">
                    <img src={new_logo} alt="logo" className="poll-logo"/>
	    			<form>
                        <button className = "btn sign-button" formAction="/login" >Sign in</button>
                    </form>
    			</MDBContainer>
                <MDBContainer fluid className="p-b-box">
                    <h1 className="register-text">
                        Register with Poll Buddy
                    </h1>
                    <p className="register-blurb">
                        To create an account, fill in the text boxes, then press submit.
                    </p>
                    <MDBContainer className="form-group">
                        <input type="email" className="form-control" placeholder="Enter your name" className="enterName"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input type="email" className="form-control" placeholder="Enter your email" className="enterEmail"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input type="email" className="form-control" placeholder="Enter your password" className="enterPassword"/>
                    </MDBContainer>
                    <form>
                        <button className="btn submit-button" formAction="/accountinfo" >Submit</button>
                    </form>
                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
