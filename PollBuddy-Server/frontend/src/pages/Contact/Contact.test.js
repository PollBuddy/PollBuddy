import React from "react";
import ReactDOM from "react-dom";
import Contact from "./Contact";

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      data: {
        FirstName: "John",
        LastName: "Doe",
        SchoolAffiliation: "RPI",
        Email: "johndoe@rpi.edu"
      }
    })
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<Contact updateTitle={updateTitle} onDoneLoading={() => {
  }}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
