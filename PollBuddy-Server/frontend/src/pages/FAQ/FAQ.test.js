import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import FAQ from "./FAQ";

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>;
});

jest.mock("./faq.md", () => "Test");

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve({text: ""})
}));

describe("The FAQ page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><FAQ updateTitle={updateTitle}/></BrowserRouter>);
  });
});