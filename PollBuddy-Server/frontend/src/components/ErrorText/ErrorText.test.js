import React from "react";
import ReactDOM from "react-dom";
import ErrorText from "./ErrorText";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ErrorText />, div);
  ReactDOM.unmountComponentAtNode(div);
});