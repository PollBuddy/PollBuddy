import React, {Component} from 'react';
import './login.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class login extends Component {
  render() {    
    return (
     <div className="page-login">

          <MDBBtn size = "lg"  color = "secondary">About Us</MDBBtn>

        <header className="Login-header">
            <h2>
              PollBuddy
            </h2>
        </header>

        <div className="d-flex p-2 Login-Box">

            <header Login = "LoginElements">

                <MDBContainer>
                    <MDBRow>
                        <MDBCol md="6">
                            <form>
                                <p className="h5 text-center mb-4">Sign in</p>
                                <div className="white-text">
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
                                </div>
                            <div className="text-right">
                                <MDBBtn size = "lg" color = "secondary">Sign In</MDBBtn>
                                <MDBBtn size = "lg" color = "secondary">Forgot Your Password</MDBBtn>
                            </div>
                        </form>
                    </MDBCol>
                    </MDBRow>
                </MDBContainer>

             </header>

         </div>

        </div>
    )
  }
}
