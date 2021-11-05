import React from "react";
import ReactDOM from "react-dom";
import Popup2 from "./Popup2";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Popup2 />, div);
  ReactDOM.unmountComponentAtNode(div);
});