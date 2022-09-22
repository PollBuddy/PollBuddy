import React from "react";
import ReactDOM from "react-dom";
import Groups from "./Groups";
import {BrowserRouter} from "react-router-dom";
import GroupEdit from "../GroupEdit/GroupEdit";

function updateTitle() {
  return false;
}

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
    <Groups updateTitle={updateTitle}/>
  </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
