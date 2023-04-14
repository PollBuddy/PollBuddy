import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import Header from "./Header";

const USER_INFO = { sessionIdentifier: "" };

describe("The Header component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><Header userInfo={USER_INFO}/></BrowserRouter>);
  });

  it("Contains logo that links to home.", () => {
    render(<BrowserRouter><Header userInfo={USER_INFO}/></BrowserRouter>);
    // TODO: Fix this code so it no longer throws a linting error.
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByAltText("logo").parentNode).toHaveAttribute("href", "/");
  });

  it("Contains a dropdown.", () => {
    render(<BrowserRouter><Header userInfo={USER_INFO}/></BrowserRouter>);

    expect(screen.getByText.bind(this, "Menu")).not.toThrow();
  });
});
