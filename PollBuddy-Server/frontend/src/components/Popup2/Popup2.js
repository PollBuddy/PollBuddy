import React from "react";
import "./Popup2.scss";

/*----------------------------------------------------------------------------*/

function Popup2({ dim, text, handleModal }) {
  return (
    <div className="shell">
      { dim && <div className="popup2-modal-overlay"/> }
      <div className={dim ? "popup2-modal_dim" : "popup2-modal_nodim"}>
        <div className="popup2-modal-topbar">
        </div>
        <div className="popup2-modal-container">
          <div className="popup2-modal-guts">
            <p className="popup2-modal-text">{text}</p>
            <button className="popup2-close-button" onClick={handleModal}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*----------------------------------------------------------------------------*/

export default Popup2;