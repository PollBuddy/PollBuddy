import React from "react";
import { render, /*screen, act*/ } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";

import QuestionEditor from "./QuestionEditor";

// THIS COMPONENT IS NOT BEING USED, SO WHEN THIS COMPONENT IS BEING USED, MAKE
// VIABLE TESTS FOR THIS.

describe("The QuestionEditor component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><QuestionEditor/></BrowserRouter>);
  });
});