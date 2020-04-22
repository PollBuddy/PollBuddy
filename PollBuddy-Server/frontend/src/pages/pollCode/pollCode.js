import React, { Component } from 'react';
import './pollCode.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

export default class pollCode extends Component {
	componentDidMount(){
		document.title = "Poll Code - " + document.title;
	}
  render() {
    return (
    		<MDBContainer fluid className="poll-homepage">
    			<img src="logo.png" alt="logo" class="img-fluid animated bounce infinite logo poll-logo"/>

	    		<div className="form-group">
			      <input type="email" className="form-control" placeholder="Poll Code" class="enterCode"/>
			    </div>
			    <button class = "btn poll-button">Join Poll</button>
    		</MDBContainer>
    		
    	)
	}
}