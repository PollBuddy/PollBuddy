import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer } from 'mdbreact';
import { Link } from '@reach/router';
import logo from '../../images/logo.png';

import Header from "../../components/header/header.js"

export default class homepage extends Component {

    componentDidMount(){
        document.title = "Home - " + document.title;
    }

    render() {
        return (
            <MDBContainer className="page-homepage">
                <Header btn = "login" />
                <header className="Homepage-header">
                    <img src={logo} className="img-fluid animated bounce infinite logo" alt="logo" />

                    <p className = "blurb"> An interactive questionnaire platform made by students, for
                        students, to strengthen lecture material and class attentiveness.
                    </p>

                    <MDBContainer className="text-right">
                        <Link to={"/login"}>
                            <button class = "btn button">Sign In</button>
                        </Link>
                        <Link to={"/registerDefault"}>
                            <button class = "btn button">Sign Up</button>
                        </Link>
                    </MDBContainer>

                </header>
            </MDBContainer>
        )
    }
}
