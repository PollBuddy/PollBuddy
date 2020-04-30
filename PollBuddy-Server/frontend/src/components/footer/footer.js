import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import './footer.scss';
import rcos_logo from '../../rcos.png';
import github_logo from '../../github.png'

export default class Footer extends Component {
	render() {
		return (
			<footer className = "foot">
				<div className = "linethru"></div>
				<div className = "logo_links">
					<a href = "https://rcos.io/" target = "_blank" rel="noopener noreferrer">
						<img src = {rcos_logo} alt = "RCOS" />
					</a>
					<a href = "https://github.com/PollBuddy/PollBuddy" target = "_blank" rel="noopener noreferrer">
						<img src = {github_logo} alt = "Github" />
					</a>
				</div>
				<div className = "foot_text">
					<a href = "/">
						About Us
					</a>
					<a href = "https://info.rpi.edu/statement-of-accessibility" target = "_blank" rel = "noopener noreferrer">
						Statement of Accessibility
					</a>
					Questions, comments, etc? Email us: someemail@yeah.com
				</div>
			</footer>
		)
	}
}
