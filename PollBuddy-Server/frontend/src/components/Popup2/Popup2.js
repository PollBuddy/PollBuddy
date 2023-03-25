import React from "react";

import "./Popup2.scss";
import {MDBContainer, MDBPopper} from "mdbreact";

export default class Popup2 extends React.Component {

  render() {
    if(this.props.twoOptions) {
        return(
          <MDBContainer className="modal">
            <MDBContainer className="overlay"/>
            <MDBContainer className="popup2-modal-topbar"/>
            <MDBContainer className="modal-content">
              <p className="modal-text">{this.props.text}</p>
                <MDBContainer className={"modal-options"}>
                  <button className="button" onClick={this.props.handleDeny}>{this.props.denyText}</button>
                  <button className="button" onClick={this.props.handleConfirm}>{this.props.confirmText}</button>
                </MDBContainer>
            </MDBContainer>
          </MDBContainer>
        );
    } else {
      return (
        <MDBContainer className="modal">
          <MDBContainer className="overlay"/>
          <MDBContainer className="popup2-modal-topbar"/>
          <MDBContainer className="modal-content">
            <p className="modal-text">{this.props.text}</p>
            <MDBContainer className={"modal-singular-option"}>
              <button className="button" onClick={this.props.handleConfirm}>{this.props.confirmText}</button>
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
