import React from "react";
import ReactDOM from "react-dom";
import Homepage from "./Homepage";
import { BrowserRouter } from "react-router-dom";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <Homepage />
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
