import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import { Router, Link } from '@reach/router';

export default class homepage extends Component {
    render() {
        return (
            <MDBContainer className="page-homepage">
                <header className="Homepage-header">

                    <img src="logo.svg" class="img-fluid animated bounce infinite logo">
                    </img>

                    <p className = "blurb"> An interactive questionnaire platform made by students, for
                        students, to strengthen lecture material and class attentiveness.
                    </p>

                    <MDBContainer className="text-right">
                        <Link to={"/login"}>
                            <button class = "btn button">Sign In</button>
                        </Link>
                        <button class = "btn button">Sign Up</button>
                    </MDBContainer>

                </header>
            </MDBContainer>
        )
    }
}
