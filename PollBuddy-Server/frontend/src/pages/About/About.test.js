import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import About from "./About";

jest.mock("react-markdown", () => (props) => {
  // TODO: Fix this code so it no longer throws a linting error.
  // eslint-disable-next-line testing-library/no-node-access
  return <>{props.children}</>;
});

jest.mock("./About.md", () => "Test");

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve("TEST")
}));

// Create basic render test
describe("The About page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><About updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText("TEST")));
  });
});
