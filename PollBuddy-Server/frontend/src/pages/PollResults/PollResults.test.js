import React from "react";
import ReactDOM from "react-dom";
import PollResults from "./PollResults";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<PollResults />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});