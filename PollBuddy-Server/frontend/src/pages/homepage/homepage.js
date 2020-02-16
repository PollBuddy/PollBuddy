import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import { Router, Link } from '@reach/router';
import new_logo from '../../Poll_buddy_logo_v5.png';

//MoolBoran
export default class homepage extends Component {
  render() {
    return (
        <MDBContainer className="page-homepage">
            <header className="Homepage-top">
                <img src={new_logo} className="top_left_logo" alt="logo"/>

                <MDBContainer className="Welcome-box">
                        Welcome to PollBuddy!
                </MDBContainer>

                <MDBContainer className="d-flex p-2 Homepage-box">
                    PollBuddy is an interactive platform for educators to connect with students in a virtual classroom.
                </MDBContainer>

                {/*for some reason, the href to /login below is not working*/}
                <button onClick="location.href = '/login';" className="btn button" >Login/Register</button>

                <MDBContainer className="poll-code">
                    <MDBInput label="Enter Poll Code" size="sm" class="poll-code"/>
                </MDBContainer>


  </header>
        </MDBContainer>
    )
  }
}
