import React, { Component } from 'react';
import './login.scss'
import { navigate } from "@reach/router"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
export default class login extends Component {
    constructor(){
        super();
        console.log(localStorage.getItem('loggedIn'));//todo remove if this works
        if(localStorage.getItem('loggedIn'))navigate('/myclasses');//todo test if this works
    }
    handleLogin() {
        //needs some authentication before and if authentication passes then set local storage and such
        localStorage.setItem('loggedIn', true);//maybe have an admin/teacher var instead of just true
        //OH ALSO MAYBE IN THE FUTURE USE COOKIES TO REMEMBER PAST SESSION
        navigate('/myclasses');//this is how one navigates to another page from reach router
    }
    //todo maybe render correctly all the time
    render() {
        return (
            <MDBContainer className="page-login">

                <MDBBtn size="lg" color="secondary">About Us</MDBBtn>

                <header className="Login-header">
                    <h2>
                        PollBuddy
            </h2>
                </header>

                <MDBContainer className="d-flex p-2 Login-Box">

                    <header Login="LoginElements">

                        <MDBContainer>
                            <MDBRow>
                                <MDBCol md="6">
                                    <form>
                                        <p className="h5 text-center mb-4">Sign in</p>
                                        <MDBContainer className="white-text">
                                            <MDBInput
                                                label="Type your email"
                                                icon="envelope"
                                                group
                                                type="email"
                                                validate
                                                error="wrong"
                                                success="right"
                                            />
                                            <MDBInput
                                                label="Type your password"
                                                icon="lock"
                                                group
                                                type="password"
                                                validate
                                            />
                                        </MDBContainer>
                                        <MDBContainer className="text-right">
                                            <MDBBtn size="lg" color="secondary" onClick={this.handleLogin}>Sign In</MDBBtn>
                                            <MDBBtn size="lg" color="secondary">Forgot Your Password</MDBBtn>
                                        </MDBContainer>
                                    </form>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>

                    </header>

                </MDBContainer>

            </MDBContainer>
        )
    }
}
