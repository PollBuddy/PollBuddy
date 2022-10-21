import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PollCode from './PollCode';

describe("The Footer component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><PollCode/></BrowserRouter>);

    // Has title.
    expect(screen.getByText.bind(this, "Already have a Poll Code? Enter it here:")).not.toThrow();

    // Has placeholder.
    expect(screen.getByPlaceholderText.bind(this, "Ex: P8C0D3")).not.toThrow();

    // Has button.
    expect(screen.getByText.bind(this, "Join Poll")).not.toThrow();
  });

  it("Works correctly on valid poll.", async () => {
    render(<BrowserRouter><PollCode/></BrowserRouter>);

    await userEvent.type(screen.getByPlaceholderText("Ex: P8C0D3"), "ABCDEF");
    await userEvent.click(screen.getByText("Join Poll"));
    expect(window.location.pathname).toBe("/polls/ABCDEF/view");
  });

  it("Errors correctly on invalid poll.", async () => {
    render(<BrowserRouter><PollCode/></BrowserRouter>);
    // No error message originally.
    expect(screen.getByText.bind(this, "Code must be 6 characters, A-Z, 0-9")).toThrow();

    // Error on blank messsage.
    await userEvent.click(screen.getByText("Join Poll"));
    expect(screen.getByText.bind(this, "Code must be 6 characters, A-Z, 0-9")).not.toThrow();

    // Error on long poll code.
    await userEvent.type(screen.getByPlaceholderText("Ex: P8C0D3"), "QWERTYUIOP");
    await userEvent.click(screen.getByText("Join Poll"));
    expect(screen.getByText.bind(this, "Code must be 6 characters, A-Z, 0-9")).not.toThrow();

    // Error on invalid characters.
    await userEvent.type(screen.getByPlaceholderText("Ex: P8C0D3"), "!@#$%^");
    await userEvent.click(screen.getByText("Join Poll"));
    expect(screen.getByText.bind(this, "Code must be 6 characters, A-Z, 0-9")).not.toThrow();
  });
});