import React, {Component} from 'react';
import { Link } from '@reach/router';
import { MDBBtn, MDBIcon, MDBContainer,MDBSwitch } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import new_logo from '../../Poll_Buddy_Logo_v4.png';
import './about.scss'

export default class about extends Component {

    render() {

        return (
            <MDBContainer className="page-about">
                <img src={new_logo} className="top_left_logo" alt="logo"/>

                <MDBBtn
                    size="lg"
                    className="home_button"
                    href="/"
                    color="secondary"
                >
                    <MDBIcon icon="home" />
                </MDBBtn>

                <MDBBtn
                    size="lg"
                    className="about_button"
                    href="/about"
                    color="secondary"
                >
                    <MDBIcon icon="question" />
                </MDBBtn>

                <MDBBtn
                    size="lg"
                    className="settings_button"
                    href="/settings_page"
                    color="secondary"
                >
                    <MDBIcon icon="tools" />
                </MDBBtn>

                <hr class="line_style"></hr>
                <header className="header">
                    <br></br> About PollBuddy
                </header>

                <body className="body">
                    <br></br> PollBuddy is an RCOS project designed to replace the iClicker. It was created in the fall 2019 semester.
                </body>

                <MDBBtn
                    href="https://rcos.io/"
                    className="rcos_button"
                    target="_blank"
                    size="m"
                    color="secondary"
                >
                    An RCOS Project
                </MDBBtn>

                <MDBBtn
                    href="https://info.rpi.edu/statement-of-accessibility"
                    className="accessibility_button"
                    target="_blank"
                    size="m"
                    color="secondary"
                >
                    Statement of Accessibility
                </MDBBtn>

                <MDBBtn
                    href="https://github.com/neha-deshpande001/PollBuddy"
                    className="github_button"
                    target="_blank"
                    size="m"
                    color="secondary"
                >
                    Github
                </MDBBtn>

            </MDBContainer>
        )
    }
}