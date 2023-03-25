import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Popup2 from './Popup2';

describe("The Popup2 component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><Popup2 /></BrowserRouter>);
  });

  it("Text works.", () => {
    render(<BrowserRouter><Popup2 text="TEST"/></BrowserRouter>);

    expect(screen.getByText.bind(this, "TEST")).not.toThrow();
    expect(screen.getByText.bind(this, "CLOSE")).not.toThrow();
  });

  it("onClick handle works.", async () => {
    let GOOD = false;
    const onClick = () => { GOOD = true; };
    render(<BrowserRouter><Popup2 isOpen handleModal={onClick} text="TEST"/></BrowserRouter>);

    await userEvent.click(screen.getByText("CLOSE"));
    await waitFor(() => GOOD, { timeout: 5000 });
  });
});