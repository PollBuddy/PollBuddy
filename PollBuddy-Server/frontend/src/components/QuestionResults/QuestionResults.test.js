import React from "react";
import ReactDOM from "react-dom";
import QuestionResults from "./QuestionResults";
import { BrowserRouter } from "react-router-dom";

function updateTitle() {
  return false;
}
//TODO: fix

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <QuestionResults updateTitle={updateTitle}/>
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
