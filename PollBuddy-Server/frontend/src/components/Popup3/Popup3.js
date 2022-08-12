import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Popup3.scss";

export default class Popup3 extends Component {
  render() {
    let popup = (
      <div className="Popup">
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