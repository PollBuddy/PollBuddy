import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import GroupEdit from "./GroupEdit";

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({text: ""})
}));

function updateTitle() {
  return false;
}

describe("The GroupEdit page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><GroupEdit updateTitle={updateTitle}/></BrowserRouter>);
  });
});
