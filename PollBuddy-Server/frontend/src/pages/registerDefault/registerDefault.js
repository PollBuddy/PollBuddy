import React, { Component } from 'react';
import './registerDefault.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

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
