import React from "react";
import ReactDOM from "react-dom";
import LoginWithSchool from "./LoginWithSchool";

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({text: ""})
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<LoginWithSchool updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
