import React from "react";
import ReactDOM from "react-dom";
import questionEditor from "./questionEditor";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<questionEditor />, div);
  ReactDOM.unmountComponentAtNode(div);
});