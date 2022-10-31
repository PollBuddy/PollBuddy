import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import QuestionEnded from "./QuestionEnded";

function updateTitle() {
  return false;
}

describe("The QuestionEnded page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><QuestionEnded updateTitle={updateTitle}/></BrowserRouter>);
  });
});