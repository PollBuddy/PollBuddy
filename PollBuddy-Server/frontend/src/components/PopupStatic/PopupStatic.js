import React from "react";

import "./PopupStatic.scss";

export default class PopupStatic extends React.Component {
    constructor(props) {  
        super(props);  
        this.state = {  
            showStaticModal: false,
            backdrop: "static",
            keyboard: false,
        };
    }

  render() {
    return (
      <div className="shell">
        {this.props.dim && <div className="popupstatic-modal-overlay"/>}
        <div className={this.props.dim ? "popupstatic-modal_dim" : "popupstatic-modal_nodim"}>
          <div className="popupstatic-modal-topbar">
          </div>
          <div className="popupstatic-modal-container">
            <div className="popupstatic-modal-guts">
              <p className="popupstatic-modal-text">{this.props.text}</p>
              <button className="popupstatic-confirm-button" onClick={this.props.handleModal}>CONFRIM</button>
              <button className="popupstatic-close-button" onClick={this.props.handleModal}>CLOSE</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
