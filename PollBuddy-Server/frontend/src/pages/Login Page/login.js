import React, { Component } from 'react';
import './login.scss'
import { navigate } from "@reach/router"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

import Header from "../../components/header/header.js"

export default class login extends Component {
    constructor(){
        super();
        if(localStorage.getItem('loggedIn')){
            navigate('/myclasses');//this redirects users to the route absolute specified.
            window.location.reload(false);//this forces a reload... a little barbaric i am aware
        }
    }
    handleLogin() {
        //needs some authentication before and if authentication passes then set local storage and such refer to classcreation page to see the way to make POST requests to the backend
        localStorage.setItem('loggedIn', true);//maybe have an admin/teacher var instead of just true
        //TODO MAYBE IN THE FUTURE USE COOKIES TO REMEMBER PAST SESSION
        navigate('/myclasses');//this is how one navigates to another page from reach router
    }
    render() {
        return (
            <MDBContainer className="page-login">


                <Header title = "login" btn = "up" />

                <MDBContainer className="d-flex p-2 Login-Box">

                    <header Login="LoginElements">

                        <MDBContainer>
                            <MDBRow>
                                <MDBCol md="6">
                                    <form>
                                        <MDBContainer className="text_boxes">
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
                                            <MDBBtn size="lg" color="black" className="purple">Forgot Your Password</MDBBtn>
                                            <MDBBtn size="lg" color="black" className="purple" onClick={this.handleLogin} >Submit</MDBBtn>

                                        </MDBContainer>
                                        <MDBContainer className="text-right">

                                            <MDBBtn size="lg" color="black" className="sign_up">No account? Sign up</MDBBtn>

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
