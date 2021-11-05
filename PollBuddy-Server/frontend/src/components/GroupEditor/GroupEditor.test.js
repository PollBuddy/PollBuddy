import React from "react";
import ReactDOM from "react-dom";
import GroupEditor from "./GroupEditor";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<GroupEditor />, div);
  ReactDOM.unmountComponentAtNode(div);
});