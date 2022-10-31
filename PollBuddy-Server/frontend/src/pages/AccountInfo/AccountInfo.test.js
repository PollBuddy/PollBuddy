import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import AccountInfo from "./AccountInfo";

function updateTitle() {
  return false;
}

// Create basic render test
describe("The AccountInfo page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    fetch.mockResponseOnce(JSON.stringify({ data: { } }));
    render(<BrowserRouter><AccountInfo updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() =>
      expect(screen.getByText.bind(null, "Account Settings")).not.toThrow()
    );
  });
});
