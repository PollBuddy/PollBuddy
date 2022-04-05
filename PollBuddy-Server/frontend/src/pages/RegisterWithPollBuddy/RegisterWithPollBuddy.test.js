import React from "react";
import ReactDOM from "react-dom";
import RegisterWithPollBuddy from "./RegisterWithPollBuddy";
import {BrowserRouter} from "react-router-dom";

function updateTitle() {
  return false;
}

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <RegisterWithPollBuddy updateTitle={updateTitle}/>
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
