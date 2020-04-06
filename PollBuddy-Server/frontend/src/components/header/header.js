import React, { Component } from 'react';
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import './header.scss';
import logo from "../../Poll_Buddy_Logo_v6.png";

export default class Header extends Component {
	constructor(props) {
		super(props);
		if(this.props.type == "in")		// login, signup, account info, etc
			this.state = {				// respectively in, up, info for rn
				link: "/login",
				text: "sign in"
			};
		else if(this.props.type == "up")
			this.state = {
				link: "/registerDefault",
				text: "sign up"
			};
		else if(this.props.type == "info")
			this.state = {
				link: "/accountinfo",
				text: "account"
			};
	}
	render() {
		return (
			<div className = "bar">
				<link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet" />
				<a href = "/">
					<img src = {logo} className = "logo" />
				</a>
				{this.props.title}
				<a href = {this.state.link} className = "login">
					{this.state.text}
				</a>
			</div>
		);
	}
}