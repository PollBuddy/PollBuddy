import React from "react";
import ReactDOM from "react-dom";
import Popup3 from "./Popup3";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<Popup3 />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});