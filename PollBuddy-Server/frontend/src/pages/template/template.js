import React, { Component } from 'react';
import { Link } from '@reach/router';
import { MDBBtn, MDBIcon, MDBContainer } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import new_logo from '../../Poll_Buddy_Logo_v4.png';
import './template.scss'

export default class Template extends Component {//this class is an example of how to use get requests so frontend team can eventually connect to backend refer to class creation for post requests
    constructor() {
        super();
        this.state = {
            groups: []
        }
    }
    componentWillMount() {//this function is called before the components are mounted
        fetch('http://localhost:3001/api/groups/').then(res => {//this is how one calls a get request (backend specifically made a method for finding all groups)
            return res.json();
        }).then(myJson => {
            console.log(myJson);
            for (let i = 0; i < myJson.length; i++) {
                fetch('http://localhost:3001/api/groups/' + myJson[i] + '/').then(res => {//this is how one calls a get request (backend specifically made one for finding a specific group)
                    return res.json();
                }).then(myJson => {
                    this.state.groups[i] = myJson;
                })
            }
        })
        console.log(this.state.groups);
    }
    /*backend users routes isn't completely finished i think so 
    cannot start working on a completely functional users page 
    so this is gonna be a mock page that just gets all classes and displays all their info*/
    render() {
        return (
            <MDBContainer className="page-my-classes">
                <img src={new_logo} className="top_left_logo" alt="logo" />
                <hr class="line_style"></hr>
                <header className="header">
                    <br></br> TEST:
        </header>

                <MDBContainer className="buttons">

                </MDBContainer>
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