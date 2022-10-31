import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Contact from "./Contact";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ data: {
    FirstName: "John",
    LastName: "Doe",
    SchoolAffiliation: "RPI",
    Email: "johndoe@rpi.edu"
  } })
}));

describe("The Contact page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><Contact updateTitle={updateTitle} onDoneLoading={() => {}}/></BrowserRouter>);
    await waitFor(() =>
      expect(screen.getByDisplayValue.bind(null, "John Doe")).not.toThrow()
    );
  });
});