import React, { Component } from 'react';
import './login.scss'
import {Link, Redirect} from "react-router-dom";
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class login extends Component {

    state = {
        successfulLogin: false
    };

    constructor(){
        super();
        if(localStorage.getItem('loggedIn')){
            this.setState({successfulLogin: true}) // Tell it to redirect to the next page if already logged in
        }
    }
    handleLogin() {
        //needs some authentication before and if authentication passes then set local storage and such refer to classcreation page to see the way to make POST requests to the backend
        localStorage.setItem('loggedIn', true);//maybe have an admin/teacher var instead of just true
        //TODO MAYBE IN THE FUTURE USE COOKIES TO REMEMBER PAST SESSION
        this.setState({successfulLogin: true}) // Tell it to redirect to the next page if successful
    }
    componentDidMount(){
        this.props.updateTitle("Log in");
    }
    render() {
        this.handleLogin = this.handleLogin.bind(this); // This is needed so stuff like this.setState works

        if(this.state.successfulLogin) { // Basically redirect if the person is logged in or if their login succeeds
            return (
               <Redirect to="/myClasses" />
            )
        }
        return (
            <MDBContainer className="page-login">

                <MDBContainer className="d-flex p-2 Login-Box">

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
                                            <Link to={"/forgotPassword"}>
                                                <MDBBtn size="lg" color="black" className="purple">Forgot Your Password</MDBBtn>
                                            </Link>

                                            <MDBBtn size="lg" color="black" className="purple" onClick={this.handleLogin} >Submit</MDBBtn>
                                        </MDBContainer>

                                        <MDBContainer className="text-right">
                                            <Link to={"/registerDefault"}>
                                                <MDBBtn size="lg" color="black" className="sign_up">No account? Sign up</MDBBtn>
                                            </Link>
                                        </MDBContainer>
                                    </form>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>

                </MDBContainer>

            </MDBContainer>
        )
    }
}
