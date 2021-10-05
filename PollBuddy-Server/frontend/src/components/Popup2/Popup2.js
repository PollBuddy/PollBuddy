import React from "react";

import "./Popup2.scss";

export default class Popup2 extends React.Component {

  render() {
    return (
      <div className="shell">
        {this.props.dim && <div className="popup2-modal-overlay"/>}
        <div className={this.props.dim ? "popup2-modal_dim" : "popup2-modal_nodim"}>
          <div className="popup2-modal-topbar">
          </div>
          <div className="popup2-modal-container">
            <div className="popup2-modal-guts">
              <p className="popup2-modal-text">{this.props.text}</p>
              <button className="popup2-close-button" onClick={this.props.handleModal}>CLOSE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
