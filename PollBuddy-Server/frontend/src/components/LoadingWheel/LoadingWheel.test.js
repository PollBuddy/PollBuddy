import React from "react";
import ReactDOM from "react-dom";
import LoadingWheel from "./LoadingWheel";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LoadingWheel />, div);
  ReactDOM.unmountComponentAtNode(div);
});