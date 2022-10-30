import React from "react";
import ReactDOM from "react-dom";
import SchoolPicker from "./SchoolPicker";

// Create basic render test
it("renders without crashing", async () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({data: {schools: [], schoolLinkDict: {}}})
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<SchoolPicker onDoneLoading={() => {
  }}/>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
