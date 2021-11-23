import React from "react";
import ReactDOM from "react-dom";
import QuestionEditor from "./QuestionEditor";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<QuestionEditor />, div);
  ReactDOM.unmountComponentAtNode(div);
});