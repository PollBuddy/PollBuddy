import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import AnswerRecorded from "./AnswerRecorded";

function updateTitle() {
  return false;
}

// Create basic render test
describe("The AnswerRecorded page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><AnswerRecorded updateTitle={updateTitle}/></BrowserRouter>);
  });
});
