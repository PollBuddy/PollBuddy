import React, { Component } from 'react';
import './pollCode.scss'
import { Router, Link } from '@reach/router';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

export default class pollCode extends Component {
  render() {
    return (
    		<MDBContainer fluid className="poll-homepage">
    			<img src="logo.svg" class="img-fluid animated bounce infinite logo poll-logo">
                </img>
	    		<div className="form-group">
			      <input type="email" className="form-control" placeholder="Poll Code" class="enterCode"/>
			    </div>
			    <button class = "btn poll-button">Join Poll</button>
    		</MDBContainer>
    		
    	)
	}
}