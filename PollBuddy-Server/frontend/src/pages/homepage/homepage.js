import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdbreact';
import { Router, Link } from '@reach/router';
import new_logo from '../../Poll_buddy_logo_v5.png';

//MoolBoran
export default class homepage extends Component {
  render() {
    return (
        <MDBContainer className="page-homepage">
            <header className="Homepage-top">
                <img src={new_logo} className="top_left_logo" alt="logo"/>

                <h1>
                    Welcome to PollBuddy!
                </h1>

                <MDBContainer className="d-flex p-2 Homepage-box">
                    PollBuddy is an interactive platform for educators to connect with students in a virtual classroom.
                </MDBContainer>

                <MDBContainer className="text-right">
                    <MDBBtn size = "lg" href="#signin" outline color="purple darken-1">Sign In</MDBBtn>

                    <MDBBtn size = "lg" href="#signup" outline color="purple darken-1">Sign Up</MDBBtn>


                </MDBContainer>
                <MDBContainer className="top_left_logo">

                <MDBBtn size = "lg" href="#about" outline color="purple darken-1">About</MDBBtn>
        </MDBContainer>

                <MDBContainer className="top_left_logo">
                </MDBContainer>



                <MDBContainer className="arrow" >
                    <MDBBtn href="#signin" floating size="lg" color="gray"><MDBIcon icon="arrow-down" /></MDBBtn>
                </MDBContainer>

                <header className="Homepage-header" id="signin">
                    <h2>
                        Login Here
                    </h2>
                </header>

                <MDBContainer className="arrow" >
                    <MDBBtn href="#signup" floating size="lg" color="gray"><MDBIcon icon="arrow-down" /></MDBBtn>
                </MDBContainer>

                <header className="Homepage-header" id="signup">
                    <h2>
                        Sign up Here
                    </h2>
                </header>

                <MDBContainer className="arrow" >
                    <MDBBtn href="#about" floating size="lg" color="gray"><MDBIcon icon="arrow-down" /></MDBBtn>
                </MDBContainer>

                <header className="Homepage-header" id="about">
                    <h2>
                        About PollBuddy
                    </h2>
                </header>

            </header>
        </MDBContainer>
    )
  }
}
