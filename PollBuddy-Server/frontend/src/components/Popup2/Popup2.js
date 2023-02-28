import React from "react";

import "./Popup2.scss";

export default class Popup2 extends React.Component {

  render() {
    if(this.props.twoOptions) {
      return (
        <div className="shell">
          {this.props.dim && <div className="popup2-modal-overlay"/>}
          <div className={this.props.dim ? "popup2-modal_dim" : "popup2-modal_nodim"}>
            <div className="popup2-modal-topbar">
            </div>
            <div className="popup2-modal-container">
              <div className="popup2-modal-guts">
                <p className="popup2-modal-text">{this.props.text}</p>
                <div className={"popup2-modal-options"}>
                  <button className="popup2-choice-button" onClick={this.props.handleDeny}>{this.props.denyText}</button>
                  <button className="popup2-choice-button" onClick={this.props.handleConfirm}>{this.props.confirmText}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
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
}
