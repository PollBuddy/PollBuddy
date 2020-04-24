import React, { Component } from 'react';
import 'mdbreact/dist/css/mdb.css';
import './footer.scss';
import rcos_logo from '/images/rcos.png';
import github_logo from '/images/github.png'

export default class Footer extends Component {
	render() {
		return (
			<div className = "foot">
				<div className = "logo_links">
					<a href = "https://rcos.io/" target = "_blank">
						<img src = {rcos_logo} alt = "RCOS" />
					</a>
					<a href = "https://github.com/PollBuddy/PollBuddy" target = "_blank">
						<img src = {github_logo} alt = "Github" />
					</a>
				</div>
				<a href = "/">
					About Us
				</a>
				Questions, comments, etc? Email us: someemail@yeah.com
			</div>
		)
	}
}
