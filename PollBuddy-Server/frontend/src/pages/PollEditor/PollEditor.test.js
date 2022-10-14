import React from "react";
import ReactDOM from "react-dom";
import PollEditor from "./PollEditor";
import { BrowserRouter } from "react-router-dom";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <PollEditor />
  {/* match={{params: {pollID: "12345"}, isExact: true, path: "", url: ""}} */}
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
