import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Group from "./Group";

function updateTitle() {
  return false;
}

describe("The Group page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    fetch.mockResponseOnce(JSON.stringify({ result: "success", data: { isMember: true } }));
    fetch.mockResponseOnce(JSON.stringify({ data: [ ] }));
    render(<BrowserRouter><Group updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText.bind(null, "My Polls")).not.toThrow());
  });
});