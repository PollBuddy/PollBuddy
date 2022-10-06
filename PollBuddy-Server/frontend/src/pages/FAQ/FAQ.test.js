import React from "react";
import ReactDOM from "react-dom";
import FAQ from "./FAQ";

/*----------------------------------------------------------------------------*/

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./faq.md", () => "Test");

// Create basic render test
it("renders without crashing", () => {
  fetch.mockResponseOnce(JSON.stringify({text: "Test"}));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<FAQ />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
