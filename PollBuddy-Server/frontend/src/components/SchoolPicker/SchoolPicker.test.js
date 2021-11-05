import React from "react";
import ReactDOM from "react-dom";
import SchoolPicker from "./SchoolPicker";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SchoolPicker />, div);
  ReactDOM.unmountComponentAtNode(div);
});