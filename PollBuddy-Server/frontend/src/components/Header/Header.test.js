import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<Header userInfo={{sessionIdentifier: 1}} />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
