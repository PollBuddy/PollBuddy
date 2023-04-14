import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import RegisterDefault from "./RegisterDefault";

function updateTitle() {
  return false;
}

describe("The RegisterDefault page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><RegisterDefault updateTitle={updateTitle}/></BrowserRouter>);
  });
});