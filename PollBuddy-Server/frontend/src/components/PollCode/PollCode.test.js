import React from "react";
import ReactDOM from "react-dom";
import PollCode from "./PollCode";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<PollCode />, div);
  ReactDOM.unmountComponentAtNode(div);
});