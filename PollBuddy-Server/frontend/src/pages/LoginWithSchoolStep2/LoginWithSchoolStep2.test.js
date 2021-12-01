import React from "react";
import ReactDOM from "react-dom";
import LoginWithSchoolStep2 from "./LoginWithSchoolStep2";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<LoginWithSchoolStep2 />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});