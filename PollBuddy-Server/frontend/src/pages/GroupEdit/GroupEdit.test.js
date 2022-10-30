import React from "react";
import ReactDOM from "react-dom";
import GroupEdit from "./GroupEdit";
import {BrowserRouter} from "react-router-dom";

// Create basic render test
it("renders without crashing", () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({text: ""})
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<BrowserRouter>
    <GroupEdit updateTitle={() => {
    }}/>
  </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
