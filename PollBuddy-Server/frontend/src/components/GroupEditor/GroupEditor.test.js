import React from "react";
import ReactDOM from "react-dom";
import GroupEditor from "./GroupEditor";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<GroupEditor />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});