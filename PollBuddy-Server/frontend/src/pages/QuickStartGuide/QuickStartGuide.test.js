import React from "react";
import ReactDOM from "react-dom";
import QuickStartGuide from "./QuickStartGuide";

/*----------------------------------------------------------------------------*/

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./QuickStartGuide.md", () => "Test");

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<QuickStartGuide />, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
