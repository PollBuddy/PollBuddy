import React from "react";
import ReactDOM from "react-dom";
import Privacy from "./Privacy";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./Privacy.md", () => "Test");

function updateTitle() {
  return false;
}

beforeEach(() => {
  fetch.resetMocks();
});

// Create basic render test
it("renders without crashing", () => {
  fetch.mockResponseOnce(JSON.stringify({text: "Test"}));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <Privacy updateTitle={updateTitle}/>
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
