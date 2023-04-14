import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import { withRouter } from "./PropsWrapper";

const TestLocation = withRouter(({ router: { location } }) => {
  return <div>{location && "GOOD"}</div>;
});

const TestNavigate = withRouter(({ router: { navigate } }) => {
  return <div>{navigate && "GOOD"}</div>;
});

const TestParams = withRouter(({ router: { params } }) => {
  return <div>{params && "GOOD"}</div>;
});

const TestSearch = withRouter(({ router: { searchParams } }) => {
  return <div>{searchParams && "GOOD"}</div>;
});

describe("The PropsWrapper component:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><TestLocation/></BrowserRouter>);
  });

  it("Has location.", async () => {
    render(<BrowserRouter><TestLocation/></BrowserRouter>);
    expect(screen.getByText.bind(null, "GOOD")).not.toThrow();
  });

  it("Has navigate.", async () => {
    render(<BrowserRouter><TestNavigate/></BrowserRouter>);
    expect(screen.getByText.bind(null, "GOOD")).not.toThrow();
  });

  it("Has params.", async () => {
    render(<BrowserRouter><TestParams/></BrowserRouter>);
    expect(screen.getByText.bind(null, "GOOD")).not.toThrow();
  });

  it("Has search params.", async () => {
    render(<BrowserRouter><TestSearch/></BrowserRouter>);
    expect(screen.getByText.bind(null, "GOOD")).not.toThrow();
  });
});