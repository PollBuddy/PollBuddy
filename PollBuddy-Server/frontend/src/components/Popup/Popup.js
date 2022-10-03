import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Popup.scss";

/*----------------------------------------------------------------------------*/

function Popup({ onClose, children, isOpen }) {
  let popup;

  if (isOpen) {
    popup = (
      <div className="Popup">
        <button className="button btn" onClick={onClose}>X</button>
        <div className="Popup-text">{children}</div>
      </div>
    );
  }

  return <div>{popup}</div>;
}

/*----------------------------------------------------------------------------*/

export default Popup;