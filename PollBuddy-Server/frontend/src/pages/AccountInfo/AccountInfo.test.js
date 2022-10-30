import React from "react";
import ReactDOM from "react-dom";
import AccountInfo from "./AccountInfo";
import {BrowserRouter} from "react-router-dom";

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({data: {}})
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <AccountInfo updateTitle={updateTitle}/>
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
