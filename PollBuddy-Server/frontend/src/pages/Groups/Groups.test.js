import React from "react";
import ReactDOM from "react-dom";
import Groups from "./Groups";
import { BrowserRouter } from "react-router-dom";

beforeEach(() => {
  fetch.resetMocks();
});

// Create basic render test
it("renders without crashing", () => {
  fetch.mockResponseOnce(JSON.stringify({
    ok: true,
    result: "success",
    data: {
      admin: [],
      member: [],
    },
  }));
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(<BrowserRouter>
    <Groups />
  </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
