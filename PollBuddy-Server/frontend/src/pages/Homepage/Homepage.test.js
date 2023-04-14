import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import Homepage from "./Homepage";

function updateTitle() {
  return false;
}

describe("The Homepage page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><Homepage updateTitle={updateTitle}/></BrowserRouter>);
  });
});