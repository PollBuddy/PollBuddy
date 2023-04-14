import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import LoginWithPollBuddy from "./LoginWithPollBuddy";

function updateTitle() {
  return false;
}

describe("The LoginWithPollBuddy page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><LoginWithPollBuddy updateTitle={updateTitle}/></BrowserRouter>);
  });
});