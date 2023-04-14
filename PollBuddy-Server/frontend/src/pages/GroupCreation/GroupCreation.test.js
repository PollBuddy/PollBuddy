import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import GroupCreation from "./GroupCreation";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ text: "" })
}));

describe("The GroupCreation page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><GroupCreation updateTitle={updateTitle}/></BrowserRouter>);
  });
});