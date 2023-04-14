import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Popup from "./Popup";

describe("The Popup component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><Popup /></BrowserRouter>);
  });

  it("Hides when not open.", () => {
    render(<BrowserRouter><Popup>TEST</Popup></BrowserRouter>);

    expect(screen.getByText.bind(this, "TEST")).toThrow();
  });

  it("Visible when open.", () => {
    render(<BrowserRouter><Popup isOpen>TEST</Popup></BrowserRouter>);

    expect(screen.getByText.bind(this, "TEST")).not.toThrow();
    expect(screen.getByText.bind(this, "X")).not.toThrow();
  });

  it("onClick handle works.", async () => {
    let GOOD = false;
    const onClick = () => { GOOD = true; };
    render(<BrowserRouter><Popup isOpen onClose={onClick}>TEST</Popup></BrowserRouter>);

    await userEvent.click(screen.getByText("X"));
    await waitFor(() => GOOD, { timeout: 5000 });
  });
});