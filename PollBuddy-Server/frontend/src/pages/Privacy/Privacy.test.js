import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Privacy from "./Privacy";

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./Privacy.md", () => "Test");

function updateTitle() {
  return false;
}

beforeEach(() => {
  fetch.resetMocks();
});

describe("The Privacy page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><Privacy updateTitle={updateTitle}/></BrowserRouter>);
  });
});