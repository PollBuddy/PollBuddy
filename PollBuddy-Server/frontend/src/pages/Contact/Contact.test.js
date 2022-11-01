import React from "react";
import ReactDOM from "react-dom";
import Contact from "./Contact";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({data: {data: {
      FirstName: "John",
      LastName: "Doe",
      SchoolAffiliation: "RPI",
      email: "johndoe@rpi.edu"
    }}}));

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<Contact updateTitle={updateTitle}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
