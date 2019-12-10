import React, {Component} from 'react';
import './login.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import {Link} from "@reach/router";

export default class login extends Component {
  render() {    
    return (
     <MDBContainer className="page-login">

          <MDBBtn size = "lg"  color = "secondary">About Us</MDBBtn>

        <header className="Login-header">
            <h2>
              PollBuddy
            </h2>
        </header>

        <MDBContainer className="d-flex p-2 Login-Box">

            <header Login = "LoginElements">

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
                                <Link to={"/myclasses"}>
                                    <MDBBtn size = "lg" color = "secondary">Sign In</MDBBtn>
                                </Link>
                                <MDBBtn size = "lg" color = "secondary">Forgot Your Password</MDBBtn>
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
