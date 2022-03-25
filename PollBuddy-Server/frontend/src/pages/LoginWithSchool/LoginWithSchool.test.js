import React from "react";
import ReactDOM from "react-dom";
import LoginWithSchool from "./LoginWithSchool";

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<LoginWithSchool updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
