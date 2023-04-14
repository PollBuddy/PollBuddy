import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import QuickStartGuide from "./QuickStartGuide";

jest.mock("react-markdown", () => (props) => {
  // TODO: Fix this code so it no longer throws a linting error.
  // eslint-disable-next-line testing-library/no-node-access
  return <>{props.children}</>;
});

jest.mock("./QuickStartGuide.md", () => "Test");

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  text: () => Promise.resolve({text: ""})
}));

describe("The QuickStartGuide page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><QuickStartGuide updateTitle={updateTitle}/></BrowserRouter>);
  });
});
