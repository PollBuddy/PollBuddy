import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Error404 from "./Error404";

function updateTitle() {
  return false;
}

describe("The Error404 page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><Error404 updateTitle={updateTitle}/></BrowserRouter>);
  });
});