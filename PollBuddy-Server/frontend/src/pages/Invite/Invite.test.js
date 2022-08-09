import React from "react";
import ReactDOM from "react-dom";
import GroupInvite from "./Invite";

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./Invite.md", () => "Test");

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<GroupInvite updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});