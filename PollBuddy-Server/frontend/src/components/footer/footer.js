import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import './footer.scss';
import rcos_logo from '../../images/rcos.png';
import github_logo from '../../images/github.png'
import {MDBContainer} from "mdbreact";

export default class Footer extends Component {
	render() {
		return (
			<footer className = "foot">
				<MDBContainer className = "linethru"/>
				<MDBContainer className = "logo_links">
					<a href = "https://rcos.io/" target = "_blank" rel="noopener noreferrer">
						<img src = {rcos_logo} alt = "RCOS" />
					</a>
					<a href = "https://github.com/PollBuddy/PollBuddy" target = "_blank" rel="noopener noreferrer">
						<img src = {github_logo} alt = "Github" />
					</a>
				</MDBContainer>
				<MDBContainer className = "foot_links">
					<a href = "/">
						About
					</a>
					<a href = "https://info.rpi.edu/statement-of-accessibility" target = "_blank" rel = "noopener noreferrer">
						Accessibility
					</a>
					<a href = "mailto:contactus@pollbuddy.app">
						Contact
					</a>
					<a href = "/privacy">
						Privacy
					</a>
				</MDBContainer>
			</footer>
		)
	}
}
