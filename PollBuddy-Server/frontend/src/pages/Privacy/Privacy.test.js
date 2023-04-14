import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import Privacy from "./Privacy";

jest.mock("react-markdown", () => (props) => {
  // TODO: Fix this code so it no longer throws a linting error.
  // eslint-disable-next-line testing-library/no-node-access
  return <>{props.children}</>;
});

jest.mock("./Privacy.md", () => "Test");

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve("TEST")
}));

function updateTitle() {
  return false;
}

describe("The Privacy page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><Privacy updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText("TEST")));
  });
});
