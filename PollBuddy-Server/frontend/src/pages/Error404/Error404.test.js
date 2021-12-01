import React from "react";
import ReactDOM from "react-dom";
import Error404 from "./Error404";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<Error404 />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});