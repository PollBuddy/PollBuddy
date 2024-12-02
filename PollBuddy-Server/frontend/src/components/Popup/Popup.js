import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Popup.scss";

function Popup({ onClose, isOpen, children }) {
  return (
    <div>
      { isOpen &&
        <div className="Popup">
          <button className="button btn" onClick={onClose}>X</button>
          <div className="Popup-text">{children}</div>
        </div>
      }
    </div>
  );
}

export default Popup;