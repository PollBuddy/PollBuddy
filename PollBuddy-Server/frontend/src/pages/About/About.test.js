import React from "react";
import ReactDOM from "react-dom";
import About from "./About";

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./About.md", () => "Test");

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  global.fetch = jest.fn(() => Promise.resolve({
    text: () => Promise.resolve({text: ""})
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<About updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
