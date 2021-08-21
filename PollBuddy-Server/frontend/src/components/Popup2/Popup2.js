import React from "react";

import "./Popup2.scss";

export default class Popup2 extends React.Component {

  render() {
    return (
      <div className="shell">
        {this.props.dim && <div className="modal-overlay"/>}
        <div className={this.props.dim ? "modal_dim" : "modal_nodim"}>
          <div className="modal-topbar">
          </div>
          <div className="modal-container">
            <div className="modal-guts">
              <p className="modal-text">{this.props.text}</p>
              <button className="close-button" onClick={this.props.handleModal}>CLOSE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
