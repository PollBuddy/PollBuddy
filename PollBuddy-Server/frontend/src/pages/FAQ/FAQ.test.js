import React from "react";
import ReactDOM from "react-dom";
import FAQ from "./FAQ";

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./faq.md", () => "Test");

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve({text: ""})
}));

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<FAQ updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
