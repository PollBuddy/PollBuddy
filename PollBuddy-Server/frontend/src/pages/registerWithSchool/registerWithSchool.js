import React, { Component } from 'react';
import './registerWithSchool.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

import Header from "../../components/header/header.js"

export default class registerWithSchool extends Component {
  render() {
    return (
    		<MDBContainer fluid className="register-with-school">
    			<Header title = "Register with school" btn = "in" />
                <MDBContainer fluid className="box">
                    <h1 className="register-text">
                        Register with School
                    </h1>
                    <p className="register-blurb">
                        To create an account, enter your school name or login using RPI's CAS.
                    </p>
                    <MDBContainer className="form-group">
                        {/*TODO: make this a dropdown with all the schools instead of a text box*/}
                        <input type="email" className="form-control" placeholder="Enter School Name" className="enterEmail"/>
                    </MDBContainer>
                        <form>{/*make sure that the link works with the account info page or any other school login page*/}
                            <button className="btn submit-button" formAction="/accountinfo" >Submit School Name</button>
                        </form>
                        <form>
                            <button className="btn cas-button" formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F" >CAS (I'm an RPI student)</button>
                        </form>
                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
