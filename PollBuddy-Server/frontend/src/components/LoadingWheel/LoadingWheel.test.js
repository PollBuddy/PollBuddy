import React from "react";
import { render, /*screen, act*/ } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import LoadingWheel from "./LoadingWheel";

describe("The LoadingWheel component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><LoadingWheel/></BrowserRouter>);
  });
});