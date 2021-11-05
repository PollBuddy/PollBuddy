import React from "react";
import ReactDOM from "react-dom";
import RegisterWithSchoolStep2 from "./RegisterWithSchoolStep2";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<RegisterWithSchoolStep2 />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});