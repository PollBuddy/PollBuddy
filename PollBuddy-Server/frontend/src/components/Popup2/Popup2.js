import React from "react";

import "./Popup2.scss";

export default class Popup2 extends React.Component {
   
  render() {
    return (
			<div class="shell">
					{this.props.dim && <div class="modal-overlay"/>}
					<div class={this.props.dim ? "modal_dim" : "modal_nodim"}>
							<div class="modal-topbar">
							</div>
							<div class="modal-container">
									<div class="modal-guts">
											<p class="modal-text">{this.props.text}</p>
											<button class="close-button" onClick={this.props.handleModal}>CLOSE</button>
									</div>
							</div>
					</div>
			</div>
    )
}
}