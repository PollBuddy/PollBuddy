import React from "react";
import ReactDOM from "react-dom";
import RegisterWithSchool from "./RegisterWithSchool";

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  fetch.mockResponseOnce(JSON.stringify({ data: { schools: [ ], schoolLinkDict: { } } }));
  ReactDOM.render(<RegisterWithSchool updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
