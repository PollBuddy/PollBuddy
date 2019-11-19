import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import { Router, Link } from '@reach/router';

export default class homepage extends Component {
    render() {
        return (
            <div className="page-homepage">
            <header className="Homepage-header">

            <h1>
            Welcome to PollBuddy!
            </h1>

        <div className="d-flex p-2 Homepage-box">
            <h1>
            PollBuddy is an interactive platform for educators to connect with their students in a virtual classroom, where
            educators can ask questions during class.
            </h1>
        </div>

        <div className="text-right">
            <MDBBtn size = "lg"  color = "secondary">Sign In</MDBBtn>
            <MDBBtn size = "lg"  color = "secondary">Sign Up</MDBBtn>
        </div>

        </header>
        </div>
    )
    }
}