import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Dropdown from "./Dropdown";

describe("The dropdown component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><Dropdown /></BrowserRouter>);
  });

  it("Has correct options when not logged in.", async () => {
    // Reload the Dropdown, but when the user is not logged in.
    localStorage.setItem("loggedIn", false);
    render(<BrowserRouter><Dropdown /></BrowserRouter>);

    // Click the menu button.
    await userEvent.click(screen.getByText("Menu"));
    // Check if options have correct links.
    expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
    expect(screen.getByText("Register")).toHaveAttribute("href", "/register");
    expect(screen.getByText("Quick Start Guide")).toHaveAttribute("href", "/guide");
    expect(screen.getByText("Enter Poll Code")).toHaveAttribute("href", "/code");
  });

  it("Closes on click outside.", async () => {
    localStorage.setItem("loggedIn", false);
    render(<BrowserRouter><Dropdown /></BrowserRouter>);

    // Show dropdown.
    await userEvent.click(screen.getByText("Menu"));
    // Remove dropdown.
    await userEvent.click(document.body);

    // Check if dropdown not visible.
    expect(screen.getByText.bind(this, "Login")).toThrow();
    expect(screen.getByText.bind(this, "Register")).toThrow();
    expect(screen.getByText.bind(this, "Quick Start Guide")).toThrow();
    expect(screen.getByText.bind(this, "Enter Poll Code")).toThrow();
  });

  it("Has correct options when logged in.", async () => {
    // Reload the Dropdown, but when the user is logged in.
    localStorage.setItem("loggedIn", true);
    render(<BrowserRouter><Dropdown /></BrowserRouter>);

    // Click the menu button.
    await userEvent.click(screen.getByText("Menu"));
    // Check if options have correct links.
    expect(screen.getByText("Account")).toHaveAttribute("href", "/account");
    expect(screen.getByText("Enter Poll Code")).toHaveAttribute("href", "/code");
    expect(screen.getByText("Groups")).toHaveAttribute("href", "/groups");
    expect(screen.getByText("Quick Start Guide")).toHaveAttribute("href", "/guide");
    // The logout button has a special operation attached to it.
    expect(screen.getByText("Logout")).toHaveAttribute("href", "#");
  });
});