import React from "react";
import ReactDOM from "react-dom";
import PollEditor from "./PollEditor";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<PollEditor />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});