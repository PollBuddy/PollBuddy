import React, { Component } from 'react';
import './pollCode.scss'
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import logo from '../../images/logo.png';
import Header from "../../components/header/header.js"

export default class pollCode extends Component {
	componentDidMount(){
		document.title = "Poll Code - " + document.title;
	}
  render() {
    return (
		<MDBContainer>
			<Header title = "Poll Code" btn = "login" />
    		<MDBContainer fluid className="poll-homepage">
				<img src={logo} className="img-fluid animated bounce infinite logo" alt="logo" />

	    		<div className="form-group">
			      <input type="email" className="form-control" placeholder="Poll Code" class="enterCode"/>
			    </div>
			    <button class = "btn poll-button">Join Poll</button>
    		</MDBContainer>
		</MDBContainer>
	)
  }
}