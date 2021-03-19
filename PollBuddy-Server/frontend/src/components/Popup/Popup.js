import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Popup.scss";

export default class Popup extends Component {
  render() {
    let popup = (
      <div className="Popup">
        <button className="button btn" onClick={this.props.onClose}>X</button>
        <div className="Popup-text">{this.props.children}</div>
      </div>
    );

    if (!this.props.isOpen) {
      popup = null;
    }

    return (
      <div>
        {popup}
      </div>
    );
  }
}