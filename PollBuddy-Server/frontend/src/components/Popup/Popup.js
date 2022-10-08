import React from "react";
import "mdbreact/dist/css/mdb.css";
import "./Popup.scss";

function Popup({ onClose, children, isOpen }) {
  if (!isOpen) { return <div/>; }

  return (
    <div>
      <div className="Popup">
        <button className="button btn" onClick={onClose}>X</button>
        <div className="Popup-text">{children}</div>
      </div>
    </div>
  );
}

export default React.memo(Popup);