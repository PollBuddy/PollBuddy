import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import './header.scss';
import logo from "../../Poll_Buddy_Logo.png";

export default class Header extends Component {
	constructor(props) {
		super(props);
		if(this.props.btn === "login")
			this.state = {
				link: "/login",
				text: "login"
			};
		else if(this.props.btn === "register")
			this.state = {
				link: "/registerDefault",
				text: "register"
			};
		else if(this.props.btn === "account")
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
					<img src = {logo} className = "bar_logo" alt = "logo" />
				</a>
				{this.props.title}
				<a href = {this.state.link} className = "bar_btn">
					{this.state.text}
				</a>
			</div>
		);
	}
}
