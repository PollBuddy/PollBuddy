import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import Logo from './Poll_buddy_logo.png';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import { Router, Link } from '@reach/router';

export default class homepage extends Component {
  render() {
    return (
        <MDBContainer className="page-homepage">
            <header className="gradient">
                <button type="submit" class="signup-login"><span>Sign Up / Login</span></button>               
                <img src={Logo} alt="Hello" className="center"></img>
                <input  placeholder="Poll Code" className="poll-pin" aria-expanded="false"></input>
                <button type="submit" class="enter-code"><span>Enter</span></button>               
            </header>
        </MDBContainer>
    )
  }
}
